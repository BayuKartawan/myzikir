import { defineEventHandler, setHeader } from 'h3'
import { getZikirCache, setZikirCache } from '../utils/cache'

interface GoogleApiResponse {
    status: string;
    data: Record<string, any>;
}

export default defineEventHandler(async (event) => {
    // 1. Tentukan baseUrl (dari ENV jika ada, atau dinamis dari headers)
    const siteUrl = process.env.SITE_URL
    const host = event.node.req.headers.host || 'localhost:3000'
    const protocol = (event.node.req.headers['x-forwarded-proto'] as string) || 'https'
    const baseUrl = siteUrl ? siteUrl.replace(/\/$/, '') : `${protocol}://${host}`

    let menuConfig: any[] = []

    try {
        // 2. Ambil data menu dari cache (atau fetch langsung jika cache kosong)
        let response = getZikirCache()

        if (!response) {
            const config = useRuntimeConfig()
            if (config.apiBaseUrl) {
                const targetUrl = config.apiSecretKey
                    ? `${config.apiBaseUrl}?secret=${encodeURIComponent(config.apiSecretKey)}`
                    : config.apiBaseUrl

                response = await $fetch<GoogleApiResponse>(targetUrl)

                if (response && response.status === 'success') {
                    setZikirCache(response)
                }
            }
        }

        if (response && response.data && Array.isArray(response.data.menu_config)) {
            menuConfig = response.data.menu_config
        }
    } catch (e) {
        console.error('Gagal mengambil data menu untuk sitemap:', e)
    }

    // 3. Bangun XML Sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    // Halaman Beranda
    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/</loc>\n`
    xml += `    <changefreq>daily</changefreq>\n`
    xml += `    <priority>1.0</priority>\n`
    xml += `  </url>\n`

    // Halaman-halaman zikir dinamis dari Google Sheets
    for (const menu of menuConfig) {
        if (menu.key) {
            xml += `  <url>\n`
            xml += `    <loc>${baseUrl}/reading/${menu.key}</loc>\n`
            xml += `    <changefreq>daily</changefreq>\n`
            xml += `    <priority>0.8</priority>\n`
            xml += `  </url>\n`
        }
    }

    xml += `</urlset>`

    // 4. Set Response Header & Kembalikan XML
    setHeader(event, 'Content-Type', 'application/xml')
    return xml
})
