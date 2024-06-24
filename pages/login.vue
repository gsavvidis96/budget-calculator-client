<template>
  <div class="page-wrapper">
    <div class="mb-6 alert-wrapper">
      <v-alert
        text="In order to use the application, please first sign in."
        type="info"
        variant="tonal"
      ></v-alert>
    </div>

    <div class="d-flex flex-column">
      <v-btn
        variant="outlined"
        @click="login('google')"
        class="mb-3"
        :loading="loader === 'google'"
        size="large"
      >
        <template v-slot:prepend>
          <GoogleIcon />
        </template>

        Sign in with Google
      </v-btn>

      <v-btn
        variant="outlined"
        @click="login('github')"
        :loading="loader === 'github'"
        size="large"
      >
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
  signOut,
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
const { openSnackbar } = useBaseStore();
const {
  public: { apiUrl },
} = useRuntimeConfig();

const emailExistsError = ref(false);
const loader = ref<null | "google" | "github">(null);

const login = async (method: "google" | "github") => {
  if (loader.value) return;

  try {
    let provider;

    switch (method) {
      case "google":
        provider = new GoogleAuthProvider();
        break;
      case "github":
        provider = new GithubAuthProvider();
        break;
      default:
        throw new Error("unsupported provider");
    } // create provider based on login method

    const { user } = await signInWithPopup(auth, provider); // login with popup

    loader.value = method; // open loader

    const idToken = await user.getIdToken(); // get idToken

    const { forceRefresh } = await $fetch<{
      forceRefresh: boolean;
    }>(`${apiUrl}/auth/login`, {
      method: "POST",
      body: {
        idToken,
      },
      parseResponse: (r) => JSON.parse(r),
    }); // call login to create a user entry if not created

    if (forceRefresh) await user.getIdToken(true);

    router.replace({
      path: (route.query?.redirect as string) || "/budgets",
    }); // navigate away
  } catch (e: any) {
    if (e.code === "auth/popup-closed-by-user") return; // if user closed the popup do nothing

    signOut(auth); // always signout on error

    if (e.code === "auth/account-exists-with-different-credential")
      return (emailExistsError.value = true); // show alert if account already exists with different provider

    console.error(e); // log error

    openSnackbar({
      open: true,
      text: "Something went wrong",
      color: "error",
    }); // open snackbar
  } finally {
    loader.value = null; // close loader
  }
};
</script>

<style scoped>
.page-wrapper {
  padding-top: 50px;
}

.alert-wrapper {
  max-width: 400px;
}

.dark {
  fill: white;
}
</style>
