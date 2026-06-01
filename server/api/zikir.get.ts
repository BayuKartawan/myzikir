import { defineEventHandler, getQuery, createError, getHeader } from 'h3'
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
    // Mencegah akses langsung API dari browser (direct navigation)
    const secFetchMode = getHeader(event, 'sec-fetch-mode')
    const secFetchDest = getHeader(event, 'sec-fetch-dest')
    const accept = getHeader(event, 'accept') || ''

    if (secFetchMode === 'navigate' || secFetchDest === 'document' || accept.includes('text/html')) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Akses API langsung dilarang',
        })
    }

    const config = useRuntimeConfig()
    const query = getQuery(event)
    const tableParam = query.table as string | undefined

    if (!config.apiBaseUrl) {
        throw createError({
            statusCode: 500,
            statusMessage: 'API URL tidak terkonfigurasi di server',
        })
    }

    try {
        // Memanggil API eksternal dengan tipe eksplisit dan menyertakan secret key
        const targetUrl = config.apiSecretKey
            ? `${config.apiBaseUrl}?secret=${encodeURIComponent(config.apiSecretKey)}`
            : config.apiBaseUrl

        const response = await $fetch<GoogleApiResponse>(targetUrl)

        if (response.status !== 'success') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Gagal mendapatkan data sukses dari pusat',
            })
        }

        // Jika ada parameter table, kita filter datanya di sini
        if (tableParam) {
            // Normalisasi key (misal: zikir-setelah-shalat -> zikir_setelah_shalat)
            const normalizedKey = tableParam.replace(/-/g, '_').toLowerCase()

            // Cari key di response.data secara case-insensitive
            const actualKey = Object.keys(response.data).find(
                key => key.toLowerCase() === normalizedKey
            )

            return {
                status: 'success',
                data: actualKey ? response.data[actualKey] : []
            }
        }

        // Jika tidak ada parameter table, kembalikan semua data
        return response

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Gagal mengambil data dari server pusat',
        })
    }
})
