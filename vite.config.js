import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    assetsDir: 'static', // Prevents GitHub Pages Jekyll /assets/ folder routing conflict
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'vendor-scanner': ['@zxing/browser', '@zxing/library', 'jsqr', 'jsbarcode', 'qrcode'],
        }
      }
    }
  },
  server: {
    port: 3005,
    host: '0.0.0.0',
    open: false
  }
})
