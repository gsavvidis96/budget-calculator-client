<template>
  <div class="navbar d-flex align-center px-4">
    <NuxtLink to="/" class="text-decoration-none title">
      <div>Budget Calculator</div>
    </NuxtLink>

    <v-btn
      class="ml-auto"
      density="comfortable"
      icon="mdi-menu"
      variant="text"
      color="primary"
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
  background-color: rgb(var(--v-theme-secondaryBackground));
  border-bottom: 1px solid rgb(var(--v-theme-border));
}

.title {
  font-weight: 600;
  font-size: 18px;
  color: inherit;
}
</style>
