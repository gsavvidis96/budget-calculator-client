<template>
  <v-app>
    <navbar />

    <v-navigation-drawer v-model="drawer" temporary location="right">
      <sidebar />
    </v-navigation-drawer>
    <slot />
  </v-app>
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useBaseStore } from "@/stores/base";
import { storeToRefs } from "pinia";

const baseStore = useBaseStore();

const { drawer } = storeToRefs(baseStore);
</script>

<style scoped></style>
