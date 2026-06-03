import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import type { H3Event } from 'h3'
import { clearZikirCache } from '../utils/cache'

export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    // 1. Pastikan database API URL dikonfigurasi
    if (!config.apiBaseUrl) {
        throw createError({
            statusCode: 500,
            statusMessage: 'API URL tidak terkonfigurasi di server',
        })
    }

    // 2. Verifikasi Password Admin untuk aksi tulis (POST)
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

    // 3. Masukkan secret key untuk otentikasi GAS (Google Apps Script)
    const requestBody = {
        ...body,
        secret: config.apiSecretKey || ''
    }

    try {
        // Teruskan data ke Google Apps Script Web App
        const response = await $fetch<any>(config.apiBaseUrl, {
            method: 'POST',
            body: requestBody,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response && response.status === 'success') {
            clearZikirCache()
        }

        return response
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Gagal mengirim data ke server pusat',
        })
    }
})
