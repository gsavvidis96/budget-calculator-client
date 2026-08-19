import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3001'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('http://localhost:54321'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY': JSON.stringify('test-key'),
    'import.meta.env.VITE_PRIMEUI_LICENSE': JSON.stringify(''),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    restoreMocks: true,
  },
})
