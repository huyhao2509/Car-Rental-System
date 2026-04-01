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
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return undefined;

                    const chunkGroups = [
                        { name: 'vendor-react', packages: ['react', 'scheduler', 'prop-types'] },
                        { name: 'vendor-react-dom', packages: ['react-dom'] },
                        { name: 'vendor-router', packages: ['react-router', 'react-router-dom'] },
                        { name: 'vendor-charts', packages: ['recharts', 'd3-'] },
                        { name: 'vendor-ui', packages: ['lucide-react', 'react-icons', 'react-toastify', 'aos', 'flatpickr'] },
                        { name: 'vendor-utils', packages: ['axios', 'lodash', 'react-hook-form'] }
                    ];

                    for (const group of chunkGroups) {
                        const matched = group.packages.some((pkg) =>
                            id.includes(`/node_modules/${pkg}/`) ||
                            id.includes(`/node_modules/.pnpm/${pkg}@`) ||
                            id.includes(`/node_modules/.pnpm/${pkg.replace('/', '+')}@`)
                        );

                        if (matched) {
                            return group.name;
                        }
                    }

                    return undefined;
                }
            }
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
