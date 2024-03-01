<template>
  <div>
    <h1>LOGIN PAGE (CLIENT SIDE)</h1>

    <v-btn @click="googleLogin">Login with google</v-btn>
  </div>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from "vuefire";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

definePageMeta({
  middleware: "requires-no-auth",
});

const auth = useFirebaseAuth()!;

const googleLogin = async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped></style>
