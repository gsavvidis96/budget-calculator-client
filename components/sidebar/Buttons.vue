<template>
  <template v-if="isCurrentUserLoaded">
    <v-list-item color="primary" to="/" @click="closeDrawer">
      <template v-slot:prepend>
        <v-icon size="24px">mdi-information-outline</v-icon>
      </template>

      <v-list-item-title>About the project</v-list-item-title>
    </v-list-item>

    <v-list-item color="primary" to="/login" @click="closeDrawer" v-if="!user">
      <template v-slot:prepend>
        <v-icon size="24px">mdi-login</v-icon>
      </template>

      <v-list-item-title>Login</v-list-item-title>
    </v-list-item>

    <template v-if="user">
      <v-list-item
        color="primary"
        to="/budgets"
        :active="route.path.includes('/budgets')"
        @click="closeDrawer"
      >
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

  <v-dialog v-model="dialog" maxWidth="600">
    <div class="dialog-card">
      <LogoutConfirmation @closeDialog="dialog = false" />
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useIsCurrentUserLoaded } from "vuefire";
import LogoutConfirmation from "@/components/LogoutConfirmation.vue";
import { useCurrentUser } from "vuefire";

const isCurrentUserLoaded = useIsCurrentUserLoaded();
const user = useCurrentUser();
const { closeDrawer } = useBaseStore();
const { clearBudgetsState } = useBudgetsStore();

const route = useRoute();

const dialog = ref(false);

const openLogoutDialog = () => {
  closeDrawer();

  dialog.value = true;
};

watch(user, (newUser, oldUser) => {
  if (!newUser && oldUser) clearBudgetsState();
});
</script>

<style scoped lang="scss"></style>
