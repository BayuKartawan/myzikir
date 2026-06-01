import { defineNuxtConfig } from 'nuxt/config'
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

    // @ts-ignore
    icon: {
        clientBundle: {
            scan: true,
            sizeLimitKb: 256,
        },
    },

    // CSS path is relative to the new app directory in Nuxt 4
    css: ['~/assets/main.css'],

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    runtimeConfig: {
        // Secret keys only accessible on the server-side
        apiBaseUrl: process.env.VITE_API_URL || '',
        apiSecretKey: process.env.API_SECRET_KEY || '',
        adminPassword: process.env.ADMIN_PASSWORD || '',

        // Keys within public are also exposed client-side
        public: {}
    }
})
