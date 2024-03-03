<template>
  <div class="d-flex align-center ml-auto buttons" v-if="isCurrentUserLoaded">
    <v-btn v-if="!user" to="/login">Login</v-btn>

    <template v-if="user">
      <v-btn to="/login" variant="text">My Budgets</v-btn>

      <v-btn @click="onSignOut">Logout</v-btn>
    </template>
  </div>
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

<style scoped>
.buttons {
  gap: 8px;
}
</style>
