<template>
  <Button
    v-if="canInstall"
    outlined
    severity="secondary"
    class="max-sm:fixed max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom))] max-sm:left-1/2 max-sm:z-50 max-sm:-translate-x-1/2 max-sm:rounded-full! max-sm:border-teal-400! max-sm:bg-teal-400! max-sm:text-neutral-950! max-sm:shadow-xl"
    aria-label="Install Budget Calculator"
    @click="install"
  >
    <Download class="size-[1.1rem]" aria-hidden="true" />
    <span>Install app</span>
  </Button>

  <Dialog
    v-model:visible="showInstructions"
    modal
    :header="manualInstallPlatform === 'ios' ? 'Add to Home Screen' : 'Add to Dock'"
    class="w-[min(28rem,calc(100vw-2.5rem))]"
  >
    <div class="flex flex-col gap-4 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
      <div class="mx-auto grid size-20 place-items-center overflow-hidden rounded-2xl shadow-md">
        <img src="/pwa-192x192.png" alt="Budget Calculator app icon" class="size-full" />
      </div>

      <ol v-if="manualInstallPlatform === 'ios'" class="m-0 space-y-2 pl-5">
        <li>Open this page in Safari.</li>
        <li>
          Tap <ShareAlt class="mx-1 inline size-4" aria-label="Share" /> <strong>Share</strong> in
          the browser toolbar.
        </li>
        <li>Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</li>
      </ol>

      <ol v-else class="m-0 space-y-2 pl-5">
        <li>Open the <strong>File</strong> menu in Safari.</li>
        <li>Choose <strong>Add to Dock</strong>.</li>
        <li>Confirm by clicking <strong>Add</strong>.</li>
      </ol>
    </div>

    <template #footer>
      <Button label="Got it" @click="showInstructions = false" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Download, ShareAlt } from '@primeicons/vue'
import { ref } from 'vue'
import { usePwaInstall } from '@/composables/usePwaInstall'

const showInstructions = ref(false)
const { canInstall, hasNativePrompt, manualInstallPlatform, requestInstall } = usePwaInstall()

const install = async () => {
  if (hasNativePrompt.value) {
    await requestInstall()
    return
  }

  showInstructions.value = true
}
</script>
