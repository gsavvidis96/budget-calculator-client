<template>
  <div class="navbar d-flex align-center elevation-1 px-4">
    <NuxtLink to="/" class="text-h6 text-decoration-none text-primary">
      <div>Budget Calculator</div>
    </NuxtLink>

    <v-btn
      class="ml-auto"
      density="comfortable"
      icon="mdi-menu"
      @click="drawer = !drawer"
    />
  </div>
</template>

<script setup lang="ts">
import { useBaseStore } from "@/stores/base";
import { storeToRefs } from "pinia";

const baseStore = useBaseStore();

const { drawer } = storeToRefs(baseStore);
</script>

<style scoped>
.navbar {
  height: 64px;
}
</style>
