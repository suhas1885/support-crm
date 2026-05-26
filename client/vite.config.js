import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET

// Only validate and set up proxy in development
const serverConfig = {
  port: 5173,
}

if (process.env.NODE_ENV === 'development') {
  if (!apiProxyTarget) {
    throw new Error(
      'Missing VITE_API_PROXY_TARGET. Set it in client/.env.local (e.g. http://localhost:5000).',
    )
  }
  serverConfig.proxy = {
    '/api': {
      target: apiProxyTarget,
      changeOrigin: true,
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: serverConfig,
})
