<template>
  <div class="h-100 d-flex flex-column py-2">
    <client-only>
      <buttons />
    </client-only>

    <v-btn variant="text" class="mt-auto" prepend-icon="mdi-weather-night">
      <template v-slot:prepend>
        <v-icon color="success" size="24px">mdi-weather-night</v-icon>
      </template>

      Toggle Dark Mode
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import Buttons from "@/components/navbar/Buttons.vue";
</script>

<style scoped></style>
