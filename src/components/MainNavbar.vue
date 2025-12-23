<template>
  <v-app-bar :elevation="0" class="navbar">
    <div class="d-flex align-center flex-1 px-5">
      <router-link to="/" class="text-decoration-none font-weight-bold title">
        Budget Calculator
      </router-link>

      <v-btn
        variant="text"
        density="comfortable"
        icon
        class="ml-auto"
        @click="navigationDrawer = !navigationDrawer"
      >
        <v-icon color="primary"> mdi-menu </v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
const { navigationDrawer } = storeToRefs(useBaseStore())
</script>

<style scoped lang="scss">
.navbar {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-light));

  .title {
    color: inherit;
    text-decoration: none;
  }
}
</style>
