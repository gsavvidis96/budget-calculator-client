import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#F44336",
  },
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#F44336",
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "light",
      themes: {
        light,
        dark,
      },
    },
  });
  app.vueApp.use(vuetify);
});
