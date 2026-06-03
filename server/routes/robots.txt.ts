import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
    // 1. Tentukan baseUrl (dari ENV jika ada, atau dinamis dari headers)
    const siteUrl = process.env.SITE_URL
    const host = event.node.req.headers.host || 'localhost:3000'
    const protocol = (event.node.req.headers['x-forwarded-proto'] as string) || 'https'
    const baseUrl = siteUrl ? siteUrl.replace(/\/$/, '') : `${protocol}://${host}`

    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`

    setHeader(event, 'Content-Type', 'text/plain')
    return robots
})
