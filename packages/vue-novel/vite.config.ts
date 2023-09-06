import { fileURLToPath, URL } from 'node:url'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  logLevel: 'info',
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/novel.ts', import.meta.url)),
      name: 'NovelVue',
      fileName: 'novel-vue'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue(), vueJsx(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  }
})
