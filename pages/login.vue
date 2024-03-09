<template>
  <div>
    <h1>LOGIN PAGE (CLIENT SIDE)</h1>

    <v-btn @click="googleLogin">Login with google</v-btn>

    <v-btn @click="githubLogin">Login with github</v-btn>
  </div>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from "vuefire";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  linkWithCredential,
} from "firebase/auth";

definePageMeta({
  middleware: "requires-no-auth",
});

const auth = useFirebaseAuth()!;
const route = useRoute();
const router = useRouter();

const credentialFromError = ref<any>(null);

const googleLogin = async () => {
  try {
    const res = await signInWithPopup(auth, new GoogleAuthProvider());

    let user = await linkWithCredential(res.user, credentialFromError.value);

    router.replace({
      path: (route.query?.redirect as string) || "/budgets",
    });
  } catch (e) {
    console.error(e);
  }
};

const githubLogin = async () => {
  try {
    await signInWithPopup(auth, new GithubAuthProvider());
  } catch (error: any) {
    console.log(JSON.parse(JSON.stringify(error)));

    // Step 2: User's email already exists.
    if (error.code === "auth/account-exists-with-different-credential") {
      const credential = OAuthProvider.credentialFromError(error);

      console.log(credential);
      console.log(error.customData);

      credentialFromError.value = credential;

      const x = error?.customData?.email;

      console.log(x);
    }
  }
};
</script>

<style scoped></style>
