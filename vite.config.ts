import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://llcc.viagogo.icu',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    minify: 'terser', // 确保用 terser
    terserOptions: {
      compress: {
        drop_console: true, // 移除所有 console.*
        drop_debugger: true, // 移除 debugger
      },
    },
  },
})
