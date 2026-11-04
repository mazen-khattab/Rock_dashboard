import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Browser tests load fresh pages and do not need the React refresh runtime.
  server: { hmr: mode === 'test' ? false : undefined },
}))
