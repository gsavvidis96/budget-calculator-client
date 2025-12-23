<template>
  <v-app>
    <MainNavbar />

    <MainSidebar />

    <v-main class="d-flex flex-column">
      <RouterView />
    </v-main>

    <v-snackbar v-model="snackbar.open" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}

      <template #actions>
        <v-btn
          density="comfortable"
          variant="text"
          size="small"
          icon="mdi-close"
          @click="closeSnackbar"
        />
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
const theme = useTheme()
const isDark = useDark()
const router = useRouter()

const baseStore = useBaseStore()
const { snackbar } = storeToRefs(baseStore)
const { closeSnackbar } = baseStore

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { reset: userReset } = userStore

const { budgetsReset } = useBudgetsStore()

onMounted(async () => {
  const { data } = await supabase.auth.getClaims()

  if (data?.claims) {
    user.value = {
      id: data.claims.sub,
      email: data.claims.email!,
    }
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      userReset()
      budgetsReset()
      router.push({ path: '/login' })
    }
  })
})

watch(isDark, (newValue) => {
  theme.change(newValue ? 'dark' : 'light')
})
</script>

<style scoped lang="scss"></style>
