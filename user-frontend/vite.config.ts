import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Allow access from local network (mobile)
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api-proxy/user': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy\/user/, ''),
      },
      '/api-proxy/product': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy\/product/, ''),
      },
      '/api-proxy/cart': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy\/cart/, ''),
      },
      '/api-proxy/order': {
        target: 'http://127.0.0.1:8004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy\/order/, ''),
      },
    },
  },
})
