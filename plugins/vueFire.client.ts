import { VueFire, VueFireAuth } from "vuefire";
import { initializeApp } from "firebase/app";

export default defineNuxtPlugin((app) => {
  const {
    public: { firebaseApiKey, firebaseAuthDomain },
  } = useRuntimeConfig();

  const firebaseApp = initializeApp({
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
  });

  app.vueApp.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  });
});
