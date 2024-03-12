<template>
  <template v-if="isCurrentUserLoaded">
    <v-btn variant="text" v-if="!user" to="/login" class="rounded-0">
      <template v-slot:prepend>
        <v-icon size="24px">mdi-login</v-icon>
      </template>

      Login
    </v-btn>

    <template v-if="user">
      <v-btn variant="text" to="/budgets" class="rounded-0">
        <template v-slot:prepend>
          <v-icon size="24px">mdi-clipboard-list-outline</v-icon>
        </template>

        My Budgets
      </v-btn>

      <v-btn variant="text" @click="onSignOut" class="rounded-0">
        <template v-slot:prepend>
          <v-icon size="24px">mdi-logout</v-icon>
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

<style scoped lang="scss">
.v-btn--active {
  color: rgb(var(--v-theme-primary));
}

:deep() {
  .v-btn__overlay {
    opacity: 1 !important;
    background-color: rgba(0, 0, 0, 0.04);
  }
}
</style>
