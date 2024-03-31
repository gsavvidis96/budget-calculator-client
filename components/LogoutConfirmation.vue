<template>
  <div class="d-flex flex-column align-center wrapper ga-4">
    <div class="body-1 text-center font-weight-bold">
      Logout from Budget Calculator?
    </div>

    <div class="d-flex align-center ga-2">
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click="$emit('closeDialog')"
        >Cancel</v-btn
      >

      <v-btn variant="elevated" color="primary" size="small" @click="onSignOut"
        >Logout</v-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { signOut } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

const emit = defineEmits(["closeDialog"]);

const auth = useFirebaseAuth()!;
const router = useRouter();

const onSignOut = async () => {
  try {
    await signOut(auth);
    router.replace({ path: "/" });

    emit("closeDialog");
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped></style>
