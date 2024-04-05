<template>
  <template v-if="isCurrentUserLoaded">
    <v-list-item color="primary" to="/login" @click="closeDrawer" v-if="!user">
      <template v-slot:prepend>
        <v-icon size="24px">mdi-login</v-icon>
      </template>

      <v-list-item-title>Login</v-list-item-title>
    </v-list-item>

    <template v-if="user">
      <v-list-item color="primary" to="/budgets" @click="closeDrawer">
        <template v-slot:prepend>
          <v-icon size="24px">mdi-clipboard-list-outline</v-icon>
        </template>

        <v-list-item-title>My Budgets</v-list-item-title>
      </v-list-item>

      <v-list-item color="primary" @click="openLogoutDialog">
        <template v-slot:prepend>
          <v-icon size="24px">mdi-logout</v-icon>
        </template>

        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </template>
  </template>

  <v-dialog v-model="dialog" width="auto">
    <div class="dialog-card align-self-center pa-5 rounded">
      <LogoutConfirmation @closeDialog="dialog = false" />
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useIsCurrentUserLoaded } from "vuefire";
import LogoutConfirmation from "@/components/LogoutConfirmation.vue";
import { useCurrentUser } from "@/helpers/useCurrentUser";

const isCurrentUserLoaded = useIsCurrentUserLoaded();
const user = useCurrentUser();
const { closeDrawer } = useBaseStore();

const dialog = ref(false);

const openLogoutDialog = () => {
  closeDrawer();

  dialog.value = true;
};
</script>

<style scoped lang="scss"></style>
