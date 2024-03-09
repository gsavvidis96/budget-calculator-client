import { defineStore } from "pinia";

export const useBaseStore = defineStore("counter", () => {
  const drawer = ref(false);

  return { drawer };
});
