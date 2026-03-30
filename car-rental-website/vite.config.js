// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const fallbackBase = repoName ? `/${repoName}/` : '/'
const base = process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? fallbackBase : '/')

export default defineConfig({
    base,
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000', // Point to the new backend port
                changeOrigin: true,
                secure: false
            }
        }
    }
})
