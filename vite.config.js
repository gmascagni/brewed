import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    assetsDir: 'static', // Prevents GitHub Pages Jekyll /assets/ folder routing conflict
  },
  server: {
    port: 3000,
    open: false
  }
})
