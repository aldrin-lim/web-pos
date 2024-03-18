/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
export const hash = Math.floor(Math.random() * 90000) + 1000000
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default mergeConfig(viteConfig, {
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      devOptions: {
        enabled: process.env.NODE_ENV === 'development',
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Qrafter POS',
        short_name: 'Qrafter POS  ',
        theme_color: '#856AD4',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  test: {},
  define: process.env.NODE_ENV === 'development' ? { global: 'window' } : {},
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `[name].` + hash + `.js`,
        chunkFileNames: `[name].` + hash + `.js`,
        assetFileNames: `[name].` + hash + `.[ext]`,
      },
    },
  },
})
