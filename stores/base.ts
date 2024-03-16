interface Snackbar {
  open: boolean;
  text?: string;
  color?: string;
}

export const useBaseStore = defineStore("base", () => {
  const drawer = ref(false);
  const snackbar = ref<Snackbar>({
    open: false,
  });

  const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };

  const closeDrawer = () => {
    drawer.value = false;
  };

  const openSnackbar = (newSnackbar: Snackbar) => {
    snackbar.value = newSnackbar;
  };

  const closeSnackbar = () => {
    snackbar.value = {
      open: false,
    };
  };

  return {
    drawer,
    snackbar,
    closeSnackbar,
    toggleDrawer,
    closeDrawer,
    openSnackbar,
  };
});
