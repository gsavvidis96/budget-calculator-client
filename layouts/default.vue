<template>
  <v-app>
    <navbar />

    <v-navigation-drawer v-model="drawer" temporary location="right">
      <sidebar />
    </v-navigation-drawer>
    <slot />

    <v-snackbar v-model="snackbar.open" :color="snackbar.color">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn density="comfortable" icon="mdi-close" @click="closeSnackbar" />
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import { useBaseStore } from "@/stores/base";

const baseStore = useBaseStore();
const { closeSnackbar } = baseStore;

const { drawer, snackbar } = storeToRefs(baseStore);
</script>

<style lang="scss">
html {
  overflow-y: auto;
}

.v-navigation-drawer {
  border: none;
}

.v-btn:not(.v-btn--icon) {
  text-transform: none;
  letter-spacing: normal;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: auto !important;
  font-size: 16px;
  padding: 12px 16px;

  & .v-btn__prepend {
    margin-right: 12px;
  }
}
</style>
