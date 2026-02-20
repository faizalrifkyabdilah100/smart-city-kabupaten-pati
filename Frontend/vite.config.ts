import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api/traffic ke API eksternal supaya tidak kena CORS
      '/api/traffic': {
        target: 'http://103.110.43.236:5005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/traffic/, '/traffic'),
      },
    },
  },
})
