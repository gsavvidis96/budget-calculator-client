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

const baseStore = useBaseStore();
const { closeSnackbar } = baseStore;

const { drawer, snackbar } = storeToRefs(baseStore);
</script>

<style lang="scss">
// VUETIFY OVERRIDES

html {
  overflow-y: auto;
}

.v-navigation-drawer {
  border: none !important;
  background-color: rgb(var(--v-theme-background2)) !important;
}

.v-btn:not(.v-btn--icon) {
  text-transform: none;
  letter-spacing: normal;
  display: flex;
  align-items: center;
  height: auto !important;

  &.v-btn--size-large {
    font-size: 16px;
    padding: 8px 22px;
    & .v-btn__prepend {
      margin-right: 12px;
    }
  }

  &.v-btn--size-default {
    font-size: 16px;
    padding: 6px 16px;
    & .v-btn__prepend {
      margin-right: 8px;
    }
  }

  &.v-btn--size-small {
    font-size: 14px;
    padding: 5px 10px;

    & .v-btn__prepend {
      margin-right: 8px;
    }
  }
}

.v-menu {
  .v-overlay__scrim {
    background-color: transparent;
  }
}

.v-dialog {
  .v-overlay__scrim {
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
  }
}

// GLOBAL STYLES
.page-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;
  align-items: center;
}

.inner-wrapper {
  width: 1488px;

  @media only screen and (max-width: 1528px) {
    width: 100%;
  }
}

.dialog-card {
  width: 600px;
  background-color: rgb(var(--v-theme-background3));
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media only screen and (max-width: 648px) {
    width: 100%;
  }

  @media only screen and (max-width: 599px) {
    border-radius: 0px;
  }
}
</style>
