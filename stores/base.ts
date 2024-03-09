import { defineStore } from "pinia";

export const useBaseStore = defineStore("counter", () => {
  const drawer = ref(false);
  const snackbar = ref<{
    open: boolean;
    text?: string;
    color?: string;
  }>({
    open: false,
  });

  const closeSnackbar = () => {
    snackbar.value = {
      open: false,
    };
  };

  return { drawer, snackbar, closeSnackbar };
});
