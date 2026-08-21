<template>
  <div class="min-h-screen bg-app text-app transition-colors">
    <AppHeader v-if="auth.user" />

    <main :class="auth.user ? 'app-main' : 'min-h-screen'">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in" @after-leave="resetScroll">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <Toast position="bottom-right" />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const resetScroll = () => {
  window.scrollTo({ top: 0, left: 0 })
}
</script>
