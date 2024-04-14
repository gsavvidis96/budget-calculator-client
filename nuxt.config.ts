import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Budget Calculator",
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: "",
    },
  },
  devtools: { enabled: true },
  routeRules: {
    "/login": { ssr: false },
    "/budgets": { ssr: false },
    "/budgets/*": { ssr: false },
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "dayjs-nuxt",
    "@nuxtjs/google-fonts",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  googleFonts: {
    families: {
      Roboto: {
        wght: [100, 300, 400, 500, 700, 900],
      },
    },
  },
});
