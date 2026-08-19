<template>
  <section class="surface-card overflow-hidden rounded-2xl">
    <header
      class="flex items-center gap-4 border-b border-neutral-200 px-5 py-5 sm:px-6 dark:border-neutral-700/80"
    >
      <span
        class="grid size-10 shrink-0 place-items-center rounded-2xl"
        :class="
          type === 'INCOME'
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
            : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300'
        "
      >
        <ArrowDown v-if="type === 'INCOME'" class="size-4" aria-hidden="true" />
        <ArrowUp v-else class="size-4" aria-hidden="true" />
      </span>
      <div>
        <h2 class="m-0 text-xl font-bold text-neutral-900 dark:text-white">
          {{ type === 'INCOME' ? 'Income' : 'Expenses' }}
        </h2>
        <p class="mt-0.5 mb-0 text-sm text-neutral-500 dark:text-neutral-400">
          {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
        </p>
      </div>
      <Button
        class="ml-auto"
        :severity="type === 'EXPENSES' ? 'danger' : undefined"
        @click="emit('add')"
      >
        <Plus class="size-3.5" aria-hidden="true" />
        <span>Add</span>
      </Button>
    </header>

    <div v-if="items.length" class="divide-y divide-neutral-200 dark:divide-neutral-700/80">
      <article
        v-for="item in items"
        :key="item.id"
        class="group relative flex items-center gap-3 px-5 py-4 transition-colors before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:opacity-0 before:transition-opacity hover:bg-neutral-100 hover:before:opacity-100 focus-within:bg-neutral-100 focus-within:before:opacity-100 sm:px-6 dark:hover:bg-neutral-800/90 dark:focus-within:bg-neutral-800/90"
        :class="type === 'INCOME' ? 'before:bg-emerald-500' : 'before:bg-red-500'"
      >
        <div class="min-w-0 flex-1">
          <p class="m-0 truncate text-base font-bold text-neutral-800 dark:text-neutral-100">
            {{ item.description }}
          </p>
          <div
            v-if="type === 'EXPENSES' && item.expense_percentage !== undefined"
            class="mt-2 flex items-center gap-2"
          >
            <div class="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
              <div
                class="h-full rounded-full bg-red-500"
                :style="{ width: `${Math.min(item.expense_percentage, 100)}%` }"
              />
            </div>
            <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400"
              >{{ formatPercentage(item.expense_percentage) }} of income</span
            >
          </div>
        </div>

        <p
          class="money m-0 shrink-0 text-base font-bold"
          :class="
            type === 'INCOME'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          "
        >
          {{ type === 'INCOME' ? '+' : '−' }}{{ formatCurrency(item.value) }}
        </p>

        <div class="flex shrink-0 items-center gap-0.5">
          <Button
            text
            rounded
            severity="secondary"
            :aria-label="`Edit ${item.description}`"
            @click="emit('edit', item)"
          >
            <Pencil class="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            text
            rounded
            severity="danger"
            :aria-label="`Delete ${item.description}`"
            @click="emit('delete', item)"
          >
            <Trash class="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </article>
    </div>

    <div v-else class="px-6 py-12 text-center">
      <p class="m-0 text-base font-semibold text-neutral-600 dark:text-neutral-300">
        No {{ type === 'INCOME' ? 'income' : 'expenses' }} yet
      </p>
      <p class="mt-1 mb-0 text-sm text-neutral-500 dark:text-neutral-400">
        Add your first item to start building this budget.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp, Pencil, Plus, Trash } from '@primeicons/vue'
import type { BudgetItem, BudgetItemType } from '@/types'
import { formatCurrency, formatPercentage } from '@/utils/format'

defineProps<{
  type: BudgetItemType
  items: BudgetItem[]
}>()

const emit = defineEmits<{
  add: []
  edit: [item: BudgetItem]
  delete: [item: BudgetItem]
}>()
</script>
