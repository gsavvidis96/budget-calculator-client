<template>
  <v-app>
    <navbar />

    <slot />
  </v-app>
</template>

<script setup lang="ts">
import Navbar from "~/components/navbar/Navbar.vue";
</script>

<style scoped></style>
