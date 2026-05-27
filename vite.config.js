import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['react-redux', '@reduxjs/toolkit'],
          animations: ['framer-motion'],
          ui: ['react-icons', 'react-hot-toast', 'react-helmet-async'],
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    target: 'es2020'
  }
})
