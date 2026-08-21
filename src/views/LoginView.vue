<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex h-[4.5rem] shrink-0 items-center justify-end gap-1.5 px-5 sm:px-8">
      <PwaInstallButton />

      <Button
        text
        rounded
        severity="secondary"
        :aria-label="isDark ? 'Use light theme' : 'Use dark theme'"
        @click="toggleTheme()"
      >
        <Sun v-if="isDark" class="size-[1.1rem]" aria-hidden="true" />
        <Moon v-else class="size-[1.1rem]" aria-hidden="true" />
      </Button>
    </header>

    <main class="flex flex-1 items-center justify-center p-5 pb-[4.5rem]">
      <section class="surface-card w-full max-w-md rounded-2xl p-7 sm:p-9">
        <div class="mb-7 flex items-center gap-3">
          <img src="/app-icon.svg" alt="" class="size-11 rounded-xl shadow-sm" aria-hidden="true" />
          <div>
            <h1 class="m-0 text-xl font-bold text-neutral-950 dark:text-white">
              Budget Calculator
            </h1>
            <p class="mt-1 mb-0 text-sm text-neutral-500 dark:text-neutral-400">
              Sign in to continue
            </p>
          </div>
        </div>

        <Message
          v-if="auth.callbackError"
          severity="error"
          class="mb-5"
          closable
          @close="auth.clearCallbackError()"
        >
          {{ auth.callbackError }}
        </Message>

        <Button
          severity="secondary"
          outlined
          class="w-full border-neutral-300! bg-white! text-neutral-800! hover:bg-neutral-100! dark:border-neutral-600! dark:bg-neutral-800! dark:text-white! dark:hover:bg-neutral-700!"
          size="large"
          :disabled="loading"
          @click="login"
        >
          <Spinner v-if="loading" class="size-4 animate-spin" aria-hidden="true" />
          <img v-else :src="googleIcon" class="size-5" alt="" />
          <span>{{ loading ? 'Opening Google…' : 'Sign in with Google' }}</span>
        </Button>

        <div class="mt-3 sm:hidden">
          <PwaInstallButton mobile />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Moon, Spinner, Sun } from '@primeicons/vue'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import googleIcon from '@/assets/google-icon.svg'
import { useAppTheme } from '@/composables/useAppTheme'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const toast = useToast()
const loading = ref(false)
const { isDark, toggleTheme } = useAppTheme()

const login = async () => {
  loading.value = true

  try {
    await auth.signInWithGoogle()
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Could not start sign in',
      detail: 'Please try again.',
      life: 5000,
    })
    loading.value = false
  }
}
</script>
