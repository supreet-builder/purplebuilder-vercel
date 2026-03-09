import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Multi-page app: landing page at / and simulation app at /app
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),   // Landing page → dist/index.html
        app:  resolve(__dirname, 'app.html'),      // React SPA  → dist/app.html
      },
    },
  },
})
