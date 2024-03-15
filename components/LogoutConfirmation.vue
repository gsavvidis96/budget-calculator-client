<template>
  <div class="d-flex flex-column align-center wrapper">
    <div class="body-1 text-center font-weight-bold">
      Logout from Budget Calculator?
    </div>

    <div class="d-flex align-center btn-wrapper">
      <v-btn variant="text" color="primary" @click="$emit('closeDialog')"
        >Cancel</v-btn
      >

      <v-btn variant="elevated" color="primary" @click="onSignOut"
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

<style scoped>
.wrapper {
  gap: 16px;
}

.btn-wrapper {
  gap: 8px;
}
</style>
