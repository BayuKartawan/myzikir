import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-02-02',

    // Opt-in to Nuxt 4 directory structure and features
    future: {
        compatibilityVersion: 4,
    },

    devtools: { enabled: true },

    modules: ['@nuxt/icon'],

    // CSS path is relative to the new app directory in Nuxt 4
    css: ['~/assets/main.css'],

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    runtimeConfig: {
        // Keys within public are also exposed client-side
        public: {
            apiBaseUrl: process.env.VITE_API_URL || ''
        }
    }
})
