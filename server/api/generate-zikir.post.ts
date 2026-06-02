import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { GoogleGenAI } from '@google/genai'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    // 1. Verifikasi Password Admin
    if (!config.adminPassword) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Password admin belum dikonfigurasi di server',
        })
    }

    const password = getHeader(event, 'x-admin-password')
    if (password !== config.adminPassword) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Password admin tidak valid',
        })
    }

    // 2. Pastikan Gemini API Key dikonfigurasi
    if (!config.geminiApiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'GEMINI_API_KEY tidak dikonfigurasi di server. Silakan tambahkan ke file .env Anda.',
        })
    }

    const { label, description, instructions, mode = 'generate', arab, terjemah, sub_menu } = body

    // 3. Tentukan prompt dan schema berdasarkan mode
    let prompt = ''
    let schema: any = null

    if (mode === 'assist') {
        prompt = `Anda adalah seorang ahli agama Islam. Tugas Anda adalah melakukan koreksi dan penyelarasan pada bacaan dzikir tunggal berikut:
Teks Arab Saat Ini: "${arab || ''}"
Terjemahan Saat Ini: "${terjemah || ''}"
Kategori/Sub Menu Saat Ini: "${sub_menu || ''}"
Instruksi Tambahan Pengguna: "${instructions || 'Perbaiki harakat Arab jika salah, koreksi ejaan kosakata Arab yang keliru, dan pastikan terjemahan bahasa Indonesia selaras dan tepat.'}"

Harap analisis input di atas, lalu kembalikan versi yang sudah dikoreksi/diperbaiki dalam format JSON sesuai schema.`

        schema = {
            type: 'object',
            description: 'Data zikir tunggal yang sudah dikoreksi',
            properties: {
                sub_menu: { type: 'string', description: 'Kategori/sub-menu zikir yang dikoreksi' },
                arab: { type: 'string', description: 'Teks arab lengkap dengan harakat yang sudah dikoreksi dan tepat' },
                terjemah: { type: 'string', description: 'Terjemahan bahasa Indonesia yang sudah diselaraskan secara tepat' }
            },
            required: ['arab', 'terjemah']
        }
    } else {
        // Mode 'generate' (batch zikir generator)
        if (!label) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parameter "label" (Nama Menu) harus diisi untuk mode generate',
            })
        }

        prompt = `Anda adalah seorang ahli agama Islam. Buatlah daftar bacaan dzikir/doa lengkap dalam format JSON yang valid untuk kategori/topik: "${label}".
Deskripsi Kategori: "${description || 'Tidak ada deskripsi'}"
Instruksi Tambahan Pengguna: "${instructions || 'Hasilkan beberapa dzikir/doa yang relevan'}"

Harap hasilkan minimal 3 sampai 10 bacaan dzikir/doa yang sesuai secara berurutan. Format output HARUS berupa array JSON sesuai schema.`

        schema = {
            type: 'array',
            description: 'Daftar baris dzikir/doa',
            items: {
                type: 'object',
                properties: {
                    no: { type: 'integer', description: 'Nomor urut zikir dimulai dari 1' },
                    sub_menu: { type: 'string', description: 'Judul bagian/kategori dzikir, jika ada (misal: "Istighfar", "Tasbih", "Doa Pembuka"). Bisa kosong/tidak ada.' },
                    arab: { type: 'string', description: 'Teks arab zikir/doa lengkap dengan harakat yang benar' },
                    terjemah: { type: 'string', description: 'Terjemahan bahasa Indonesia lengkap yang benar' }
                },
                required: ['no', 'arab', 'terjemah']
            }
        }
    }

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })
    const models = [
        'gemini-3.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite'
    ]

    let response = null
    let lastError = null

    for (const model of models) {
        try {
            console.log(`Mencoba memproses AI (${mode}) menggunakan model: ${model}`)
            response = await ai.models.generateContent({
                model: model,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema
                }
            })

            if (response) {
                console.log(`Berhasil memproses AI (${mode}) menggunakan model: ${model}`)
                break
            }
        } catch (err: any) {
            console.warn(`Model ${model} gagal atau tidak tersedia:`, err.message || err)
            lastError = err
        }
    }

    if (!response) {
        throw createError({
            statusCode: lastError?.statusCode || 500,
            statusMessage: `Semua model Gemini (${models.join(', ')}) gagal memproses permintaan: ${lastError?.message || lastError}`,
        })
    }

    try {
        const textResponse = response.text
        if (!textResponse) {
            throw new Error('Menerima respons kosong dari Gemini AI')
        }

        const parsedData = JSON.parse(textResponse)
        return {
            status: 'success',
            data: parsedData
        }

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Gagal mengurai respons dari Gemini AI',
        })
    }
})
