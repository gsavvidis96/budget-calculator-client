<template>
  <article
    class="budget-card surface-card group relative flex min-h-60 flex-col overflow-hidden rounded-2xl p-6 transition-colors"
  >
    <div class="flex items-start gap-4">
      <div class="min-w-0 flex-1">
        <div
          v-if="budget.is_pinned"
          class="mb-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
        >
          <Thumbtack class="size-3" aria-hidden="true" />
          Pinned
        </div>
        <RouterLink
          :to="`/budgets/${budget.id}`"
          class="block truncate text-xl font-bold text-neutral-900 no-underline after:absolute after:inset-0 dark:text-white"
        >
          {{ budget.title }}
        </RouterLink>
        <p class="mt-1 mb-0 text-sm text-neutral-500 dark:text-neutral-400">
          Created {{ formatDate(budget.created_at) }}
        </p>
      </div>

      <Button
        text
        rounded
        severity="secondary"
        class="relative z-10 shrink-0"
        :aria-label="`Open actions for ${budget.title}`"
        aria-haspopup="true"
        @click="actions?.toggle($event)"
      >
        <EllipsisH class="size-4" aria-hidden="true" />
      </Button>

      <Popover ref="actions" class="w-48">
        <div class="flex flex-col gap-1 p-1">
          <Button text severity="secondary" class="justify-start!" @click="runAction('edit')">
            <Pencil class="size-4" aria-hidden="true" /><span>Edit</span>
          </Button>
          <Button
            text
            severity="secondary"
            class="justify-start!"
            :disabled="pinning"
            @click="runAction('pin')"
          >
            <Spinner v-if="pinning" class="size-4 animate-spin" aria-hidden="true" />
            <Thumbtack v-else class="size-4" aria-hidden="true" />
            <span>{{ budget.is_pinned ? 'Unpin' : 'Pin' }}</span>
          </Button>
          <Button text severity="danger" class="justify-start!" @click="runAction('delete')">
            <Trash class="size-4" aria-hidden="true" /><span>Delete</span>
          </Button>
        </div>
      </Popover>
    </div>

    <div class="mt-auto pt-10">
      <p class="m-0 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
        Current balance
      </p>
      <p
        class="money mt-2 mb-0 text-3xl font-bold"
        :class="
          budget.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-neutral-950 dark:text-white'
        "
      >
        {{ formatCurrency(budget.balance) }}
      </p>
    </div>

    <RouterLink
      :to="`/budgets/${budget.id}`"
      class="relative z-10 mt-6 inline-flex w-fit items-center gap-2 text-base font-bold text-teal-600 no-underline dark:text-teal-300"
    >
      View details
      <ArrowRight class="size-4" aria-hidden="true" />
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { ArrowRight, EllipsisH, Pencil, Spinner, Thumbtack, Trash } from '@primeicons/vue'
import { ref } from 'vue'
import Popover from 'primevue/popover'
import type { BudgetSummary } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format'

defineProps<{
  budget: BudgetSummary
  pinning?: boolean
}>()

const emit = defineEmits<{
  edit: []
  pin: []
  delete: []
}>()

const actions = ref<InstanceType<typeof Popover> | null>(null)

const runAction = (action: 'edit' | 'pin' | 'delete') => {
  actions.value?.hide()

  if (action === 'edit') emit('edit')
  if (action === 'pin') emit('pin')
  if (action === 'delete') emit('delete')
}
</script>
