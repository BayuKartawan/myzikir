import { defineEventHandler, getQuery, createError } from 'h3'
import type { H3Event } from 'h3'

// Interface untuk data dari Google Apps Script
interface GoogleApiResponse {
    status: string;
    data: Record<string, any>;
}

// Interface untuk response yang kita berikan ke frontend
interface LocalApiResponse {
    status: string;
    data: any;
}

export default defineEventHandler(async (event: H3Event): Promise<LocalApiResponse | GoogleApiResponse> => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const tableParam = query.table as string | undefined

    if (!config.public.apiBaseUrl) {
        throw createError({
            statusCode: 500,
            statusMessage: 'API URL tidak terkonfigurasi di server',
        })
    }

    try {
        // Memanggil API eksternal dengan tipe eksplisit
        const response = await $fetch<GoogleApiResponse>(config.public.apiBaseUrl)

        if (response.status !== 'success') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Gagal mendapatkan data sukses dari pusat',
            })
        }

        // Jika ada parameter table, kita filter datanya di sini
        if (tableParam) {
            // Normalisasi key (misal: zikir-setelah-shalat -> zikir_setelah_shalat)
            const normalizedKey = tableParam.replace(/-/g, '_')

            return {
                status: 'success',
                data: response.data[normalizedKey] || []
            }
        }

        // Jika tidak ada parameter table, kembalikan semua data
        return response

    } catch (error: any) {
        console.error('Fetch Error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Gagal mengambil data dari server pusat',
        })
    }
})
