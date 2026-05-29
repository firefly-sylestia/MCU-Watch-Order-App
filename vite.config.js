import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          native: ['@capacitor/core', '@capacitor/filesystem', '@capacitor/share', '@capacitor-community/media'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@vercel/speed-insights/react'],
  },
})
