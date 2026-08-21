<template>
  <header
    class="sticky top-0 z-40 border-b border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div class="mx-auto flex h-[4.5rem] w-[min(100%-2.5rem,80rem)] items-center gap-3">
      <RouterLink to="/budgets" class="flex min-w-0 items-center gap-3 no-underline">
        <img
          src="/app-icon.svg"
          alt=""
          class="size-10 shrink-0 rounded-xl shadow-sm"
          aria-hidden="true"
        />
        <span class="min-w-0">
          <span class="block truncate text-base font-bold text-neutral-900 dark:text-white"
            >Budget Calculator</span
          >
        </span>
      </RouterLink>

      <div class="ml-auto flex items-center gap-1.5">
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

        <Button
          text
          rounded
          severity="secondary"
          aria-label="Open account menu"
          aria-haspopup="true"
          @click="accountMenu?.toggle($event)"
        >
          <User class="size-[1.1rem]" aria-hidden="true" />
        </Button>

        <Popover ref="accountMenu" class="w-72">
          <div class="flex flex-col gap-4 p-1">
            <div class="min-w-0 border-b border-neutral-200 pb-4 dark:border-neutral-700">
              <p class="m-0 text-sm text-neutral-500 dark:text-neutral-400">Signed in as</p>
              <p
                class="mt-1 mb-0 truncate text-base font-semibold text-neutral-800 dark:text-neutral-100"
              >
                {{ auth.user?.email }}
              </p>
            </div>
            <Button severity="secondary" outlined class="w-full" @click="confirmLogout">
              <SignOut class="size-4" aria-hidden="true" />
              <span>Sign out</span>
            </Button>
          </div>
        </Popover>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Moon, SignOut, Sun, User } from '@primeicons/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Popover from 'primevue/popover'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useAppTheme } from '@/composables/useAppTheme'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const { isDark, toggleTheme } = useAppTheme()
const accountMenu = ref<InstanceType<typeof Popover> | null>(null)

const confirmLogout = () => {
  accountMenu.value?.hide()
  confirm.require({
    header: 'Sign out?',
    message: 'You will need to sign in again to access your budgets.',
    acceptLabel: 'Sign out',
    rejectLabel: 'Stay signed in',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await auth.signOut()
        await router.replace('/login')
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Could not sign out',
          detail: 'Please try again.',
          life: 5000,
        })
      }
    },
  })
}
</script>
