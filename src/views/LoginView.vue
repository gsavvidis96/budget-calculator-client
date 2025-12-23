<template>
  <div class="page-wrapper">
    <v-btn class="ma-auto" @click="onLogin" variant="outlined">
      <template #prepend>
        <GoogleIcon />
      </template>

      Sign in with Google
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import GoogleIcon from '@/assets/google-icon.svg'

const router = useRouter()

const onLogin = () => {
  const origin = window.location.origin
  const redirect = router.options.history.state.redirect || '/'

  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}${redirect}`,
    },
  })
}
</script>

<style scoped></style>
