import { defineEventHandler, readBody, createError } from 'h3'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    if (!config.public.apiBaseUrl) {
        throw createError({
            statusCode: 500,
            statusMessage: 'API URL tidak terkonfigurasi di server',
        })
    }

    try {
        const response = await $fetch<any>(config.public.apiBaseUrl, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Gagal mengirim data ke server pusat',
        })
    }
})
