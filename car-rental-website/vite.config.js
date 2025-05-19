// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // Thay đổi thành port của backend nếu khác
                changeOrigin: true,
                secure: false
            }
        }
    }
})
