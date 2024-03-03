<template>
  <div class="navbar d-flex align-center elevation-1 px-4">
    <NuxtLink to="/" class="text-h6 text-decoration-none text-primary">
      <div>Budget Calculator</div>
    </NuxtLink>

    <client-only>
      <buttons />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import Buttons from "@/components/navbar/Buttons.vue";
</script>

<style scoped>
.navbar {
  height: 64px;
}

.buttons {
  gap: 4px;
}
</style>
