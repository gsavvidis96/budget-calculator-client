<template>
  <template v-if="isCurrentUserLoaded">
    <v-btn variant="text" v-if="!user" to="/login">
      <template v-slot:prepend>
        <v-icon color="success" size="24px">mdi-login</v-icon>
      </template>

      Login
    </v-btn>

    <template v-if="user">
      <v-btn variant="text" to="/login">
        <template v-slot:prepend>
          <v-icon color="success" size="24px"
            >mdi-clipboard-list-outline</v-icon
          >
        </template>

        My Budgets
      </v-btn>

      <v-btn variant="text" @click="onSignOut">
        <template v-slot:prepend>
          <v-icon color="success" size="24px">mdi-logout</v-icon>
        </template>

        Logout
      </v-btn>
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

<style scoped></style>
