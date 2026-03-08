import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  optimizeDeps: {
    exclude: ['three'], // don't pre-bundle three — it comes from CDN window.THREE
  },
  build: {
    rollupOptions: {
      // All `import ... from 'three'` → window.THREE (CDN r155, same as Shery uses)
      external: ['three'],
      output: {
        globals: { three: 'THREE' },
      },
    },
  },
});
