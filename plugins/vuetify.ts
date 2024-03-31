import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#26a69a",
    border: "#eeeeee",
    navbarBackground: "#fafafa",
    sidebarBackground: "#ffffff",
    budgetCardBackground: "#F5F5F5",
  },
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#26a69a",
    border: "#424242",
    navbarBackground: "#212121",
    sidebarBackground: "#424242",
    budgetCardBackground: "#424242",
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
