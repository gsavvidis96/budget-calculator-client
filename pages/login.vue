<template>
  <div class="d-flex flex-column flex-grow-1 px-5 pb-5 align-center wrapper">
    <div class="mb-6 alert-wrapper">
      <v-alert
        text="In order to use the application, please first sign in."
        type="info"
        variant="tonal"
      ></v-alert>
    </div>

    <div class="d-flex flex-column">
      <v-btn variant="outlined" @click="googleLogin" class="mb-2">
        <template v-slot:prepend>
          <GoogleIcon />
        </template>

        Sign in with Google
      </v-btn>

      <v-btn variant="outlined" @click="githubLogin">
        <template v-slot:prepend>
          <GitHubIcon :class="{ dark: isDark }" />
        </template>

        Sign in with GitHub
      </v-btn>
    </div>

    <div class="mt-6 alert-wrapper">
      <v-alert
        v-model="emailExistsError"
        text="Error: Unable to sign in. It appears that you already have an account associated with this email address through a different authentication provider (such as Google)"
        type="error"
        variant="tonal"
        closable
        icon="mdi-alert"
      ></v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from "vuefire";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import GoogleIcon from "@/components/GoogleIcon.vue";
import GitHubIcon from "@/components/GitHubIcon.vue";
const isDark = useDark();

definePageMeta({
  middleware: "requires-no-auth",
});

const auth = useFirebaseAuth()!;
const route = useRoute();
const router = useRouter();
const baseStore = useBaseStore();

const { openSnackbar } = baseStore;
const emailExistsError = ref<any>(false);

const googleLogin = async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());

    router.replace({
      path: (route.query?.redirect as string) || "/budgets",
    });
  } catch (e) {
    console.error(e);

    openSnackbar({
      open: true,
      text: "Something went wrong",
      color: "error",
    });
  }
};

const githubLogin = async () => {
  try {
    await signInWithPopup(auth, new GithubAuthProvider());

    router.replace({
      path: (route.query?.redirect as string) || "/budgets",
    });
  } catch (e: any) {
    if (e.code === "auth/account-exists-with-different-credential") {
      emailExistsError.value = true;

      return;
    }

    console.error(e);

    openSnackbar({
      open: true,
      text: "Something went wrong",
      color: "error",
    });
  }
};
</script>

<style scoped>
.wrapper {
  padding-top: 50px;
}

.alert-wrapper {
  max-width: 400px;
}

.dark {
  fill: white;
}
</style>
