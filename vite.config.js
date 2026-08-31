import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    assetsDir: 'static', // Prevents GitHub Pages Jekyll /assets/ folder routing conflict
  },
  server: {
    port: 3005,
    host: '127.0.0.1',
    open: false
  }
})
