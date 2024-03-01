import { VueFire, VueFireAuth } from "vuefire";
import { initializeApp } from "firebase/app";

export default defineNuxtPlugin((app) => {
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyDAzkBkt58hK28Haik2SCbda2yEN74mvhk",
    authDomain: "budget-calculator-dev.firebaseapp.com",
    projectId: "budget-calculator-dev",
    storageBucket: "budget-calculator-dev.appspot.com",
    messagingSenderId: "177554562557",
    appId: "1:177554562557:web:d181e042f7573a52b10d94",
    measurementId: "G-3J7HPNWFGC",
  });

  app.vueApp.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  });
});
