<template>
  <template v-if="isCurrentUserLoaded">
    <v-list-item color="primary" to="/login" v-if="!user">
      <template v-slot:prepend>
        <v-icon size="24px">mdi-login</v-icon>
      </template>

      <v-list-item-title>Login</v-list-item-title>
    </v-list-item>

    <template v-if="user">
      <v-list-item color="primary" to="/budgets">
        <template v-slot:prepend>
          <v-icon size="24px">mdi-clipboard-list-outline</v-icon>
        </template>

        <v-list-item-title>My Budgets</v-list-item-title>
      </v-list-item>

      <v-list-item color="primary" @click="onSignOut">
        <template v-slot:prepend>
          <v-icon size="24px">mdi-logout</v-icon>
        </template>

        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </template>
  </template>
</template>

<script setup lang="ts">
import { useIsCurrentUserLoaded, useCurrentUser } from "vuefire";
import { useFirebaseAuth } from "vuefire";
import { signOut } from "firebase/auth";

const isCurrentUserLoaded = useIsCurrentUserLoaded();
const user = useCurrentUser();
const auth = useFirebaseAuth()!;
const router = useRouter();

const onSignOut = async () => {
  try {
    await signOut(auth);

    router.replace({ path: "/" });
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped lang="scss"></style>
