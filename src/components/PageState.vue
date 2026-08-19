<template>
  <div
    class="surface-card flex min-h-64 flex-col items-center justify-center rounded-2xl px-6 py-12 text-center"
  >
    <div
      class="mb-5 grid size-14 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300"
    >
      <slot name="icon">
        <InfoCircle class="size-6" aria-hidden="true" />
      </slot>
    </div>
    <h2 class="m-0 text-xl font-bold text-neutral-900 dark:text-white">{{ title }}</h2>
    <p class="mt-2 mb-0 max-w-md text-base leading-7 text-neutral-500 dark:text-neutral-400">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-6 flex flex-wrap justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { InfoCircle } from '@primeicons/vue'

defineProps<{
  title: string
  description: string
}>()
</script>
