// @ts-nocheck
import { defineEventHandler, readBody, createError } from 'h3'
import type { H3Event } from 'h3'


export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { password } = body

    if (!config.adminPassword) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Password admin belum dikonfigurasi di server',
        })
    }

    if (password !== config.adminPassword) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Password admin tidak valid',
        })
    }

    return { status: 'success', message: 'Authenticated' }
})
