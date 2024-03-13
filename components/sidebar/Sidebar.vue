<template>
  <div class="h-100 d-flex flex-column">
    <v-list>
      <v-list-item color="primary" @click="toggleDark()">
        <template v-slot:prepend>
          <v-icon size="24px">mdi-theme-light-dark</v-icon>
        </template>

        <v-list-item-title v-text="'Toggle Dark Mode'"></v-list-item-title>
      </v-list-item>

      <client-only>
        <buttons />
      </client-only>
    </v-list>
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
