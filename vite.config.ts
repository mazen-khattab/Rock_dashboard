import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl =
    env.VITE_API_URL ||
    process.env.VITE_API_URL ||
    (mode === 'development' ? 'https://localhost:7179/api' : 'https://api.keef-wear.com/api')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    // Browser tests load fresh pages and do not need the React refresh runtime.
    server: { hmr: mode === 'test' ? false : undefined },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
  }
})
