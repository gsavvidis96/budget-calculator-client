<template>
  <div
    class="h-100 d-flex flex-column py-2 bg-secondaryBackground-lighten-1 text-textColor"
  >
    <v-btn variant="text" @click="toggleTheme" class="rounded-0">
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

const theme = useTheme();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};
</script>

<style scoped></style>
