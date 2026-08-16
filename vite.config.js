import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        // Seuraportaali ja palkkasovellus ovat erilliset sivut samassa projektissa.
        seuraportaali: resolve(import.meta.dirname, 'index.html'),
        palkat: resolve(import.meta.dirname, 'palkat.html'),
      },
    },
  },
})
