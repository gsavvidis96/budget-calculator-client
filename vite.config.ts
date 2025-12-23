import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify(),
    svgLoader(),
    ViteFonts({
      google: {
        preconnect: true,
        preconnectUrl: 'https://fonts.gstatic.com',
        fontBaseUrl: 'https://fonts.googleapis.com/css2',
        families: [
          {
            name: 'Roboto Mono',
            styles: 'ital,wght@0,100..700;1,100..700&display=swap',
          },
        ],
      },
    }),
    Components({
      dirs: ['./src/components', './src/views'],
      dts: true,
    }),
    AutoImport({
      dts: true,
      dirs: ['./src/stores', './src/lib'],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'pinia',
        'vee-validate',
        {
          axios: [['default', 'axios']],
          vuetify: ['useTheme', 'useDisplay'],
          zod: [['*', 'zod']],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
})
