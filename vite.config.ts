/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
export const hash = Math.floor(Math.random() * 90000) + 1000000

// https://vitejs.dev/config/
export default mergeConfig(viteConfig, {
  plugins: [react(), tsconfigPaths()],
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
