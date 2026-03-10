import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Multi-page app
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),      // Landing page      → dist/index.html
        simulate: resolve(__dirname, 'simulate.html'),   // Persona pick type → dist/simulate.html
        personas: resolve(__dirname, 'personas.html'),   // Persona browser   → dist/personas.html
        app:      resolve(__dirname, 'app.html'),        // React SPA         → dist/app.html
      },
    },
  },
})
