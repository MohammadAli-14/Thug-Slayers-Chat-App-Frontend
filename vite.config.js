import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ['react', 'react-dom', 'zustand'],
          utils: ['axios', 'socket.io-client'],
          ui: ['lucide-react', 'framer-motion']
        },
        // Optimize chunk names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable brotli compression for better loading
    brotliSize: true,
    chunkSizeWarningLimit: 1000
  },
  server: {
    // Development server optimizations
    hmr: {
      overlay: false
    }
  }
})