import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#26a69a",
    border: "#eeeeee",
    background1: "#fafafa",
    background2: "#ffffff",
    background3: "#f5f5f5",
  },
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#26a69a",
    border: "#424242",
    background1: "#212121",
    background2: "#424242",
    background3: "#424242",
  },
};

export default defineNuxtPlugin((app) => {
  const isDarkCookie = useCookie<boolean>("isDarkCookie");

  if (process.server && isDarkCookie.value === undefined)
    isDarkCookie.value = true;

  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: isDarkCookie.value ? "dark" : "light",
      themes: {
        light,
        dark,
      },
    },
  });
  app.vueApp.use(vuetify);
});
