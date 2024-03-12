<template>
  <div
    class="h-100 d-flex flex-column py-2 bg-secondaryBackground-lighten-1 text-textColor"
  >
    <v-btn variant="text" @click="toggleDark()" class="rounded-0">
      <template v-slot:prepend>
        <v-icon size="24px">mdi-theme-light-dark</v-icon>
      </template>

      Toggle Dark Mode
    </v-btn>

    <client-only>
      <buttons />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import Buttons from "@/components/sidebar/Buttons.vue";
import { useTheme } from "vuetify";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const theme = useTheme();
const isDarkCookie = useCookie<boolean>("isDarkCookie");

onMounted(() => {
  watch(isDark, (newValue) => {
    theme.global.name.value = newValue ? "dark" : "light";
    isDarkCookie.value = newValue;
  });
});
</script>

<style scoped></style>
