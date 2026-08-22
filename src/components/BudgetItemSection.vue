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
        <MoneyBill v-if="type === 'INCOME'" class="size-4" aria-hidden="true" />
        <Receipt v-else class="size-4" aria-hidden="true" />
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

    <div
      v-if="localItems.length"
      class="relative divide-y divide-neutral-200 dark:divide-neutral-700/80"
      :aria-busy="reordering"
      @dragover.prevent
      @drop.prevent="finishReorder"
    >
      <div
        v-if="reordering"
        class="absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden bg-neutral-200/70 dark:bg-neutral-700/70"
        role="status"
        aria-label="Saving item order"
      >
        <span
          class="reorder-progress block h-full w-1/3 rounded-full"
          :class="type === 'INCOME' ? 'bg-emerald-500' : 'bg-red-500'"
        />
      </div>

      <article
        v-for="item in localItems"
        :key="item.id"
        :data-budget-item-id="item.id"
        :draggable="!reorderDisabled"
        tabindex="0"
        :aria-label="`Reorder ${item.description}. Use drag and drop or the arrow keys.`"
        class="group relative flex cursor-grab touch-none items-center gap-3 px-5 py-4 transition-[background-color,opacity,transform] before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:opacity-0 before:transition-opacity hover:bg-neutral-100 hover:before:opacity-100 focus:bg-neutral-100 focus:outline-none focus:before:opacity-100 active:cursor-grabbing sm:px-6 dark:hover:bg-neutral-800/90 dark:focus:bg-neutral-800/90"
        :class="[
          type === 'INCOME' ? 'before:bg-emerald-500' : 'before:bg-red-500',
          draggingId === item.id ? 'z-10 opacity-55' : '',
          reordering ? 'pointer-events-none opacity-70' : '',
        ]"
        @dragstart="startMouseDrag(item.id, $event)"
        @dragenter.prevent="moveDraggedItem(item.id)"
        @dragend="cancelOrFinishReorder"
        @pointerdown="startTouchDrag(item.id, $event)"
        @pointermove="continueTouchDrag($event)"
        @pointerup="finishTouchDrag($event)"
        @pointercancel="cancelTouchDrag($event)"
        @keydown.up.prevent.self="moveWithKeyboard(item.id, -1)"
        @keydown.down.prevent.self="moveWithKeyboard(item.id, 1)"
      >
        <div class="min-w-0 flex-1">
          <p class="m-0 truncate text-base font-bold text-neutral-800 dark:text-neutral-100">
            {{ item.description }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <span
            v-if="type === 'EXPENSES' && item.expense_percentage !== undefined"
            class="inline-flex items-center rounded-full border border-red-200/80 bg-red-50 px-2 py-0.5 text-[0.7rem] leading-4 font-semibold text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300"
          >
            {{ formatPercentage(item.expense_percentage) }}
          </span>
          <p
            class="money m-0 text-base font-bold"
            :class="
              type === 'INCOME'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            "
          >
            {{ type === 'INCOME' ? '+' : '−' }}{{ formatCurrency(item.value) }}
          </p>
        </div>

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
import { MoneyBill, Pencil, Plus, Receipt, Trash } from '@primeicons/vue'
import { ref, watch } from 'vue'
import type { BudgetItem, BudgetItemType } from '@/types'
import { formatCurrency, formatPercentage } from '@/utils/format'

const props = defineProps<{
  type: BudgetItemType
  items: BudgetItem[]
  reordering?: boolean
  reorderDisabled?: boolean
}>()

const emit = defineEmits<{
  add: []
  edit: [item: BudgetItem]
  delete: [item: BudgetItem]
  reorder: [type: BudgetItemType, itemIds: string[]]
}>()

const localItems = ref([...props.items])
const draggingId = ref<string | null>(null)
const initialOrder = ref<string[]>([])
const dropped = ref(false)

watch(
  () => props.items,
  (items) => {
    localItems.value = [...items]
  },
  { deep: true },
)

const beginReorder = (itemId: string) => {
  draggingId.value = itemId
  initialOrder.value = localItems.value.map((item) => item.id)
  dropped.value = false
}

const moveDraggedItem = (targetId: string) => {
  if (!draggingId.value || draggingId.value === targetId) return
  const fromIndex = localItems.value.findIndex((item) => item.id === draggingId.value)
  const toIndex = localItems.value.findIndex((item) => item.id === targetId)
  if (fromIndex < 0 || toIndex < 0) return

  const nextItems = [...localItems.value]
  const [movedItem] = nextItems.splice(fromIndex, 1)
  if (!movedItem) return
  nextItems.splice(toIndex, 0, movedItem)
  localItems.value = nextItems
}

const hasOrderChanged = () =>
  localItems.value.some((item, index) => item.id !== initialOrder.value[index])

const finishReorder = () => {
  if (!draggingId.value) return
  dropped.value = true
  if (hasOrderChanged()) {
    emit(
      'reorder',
      props.type,
      localItems.value.map((item) => item.id),
    )
  }
  draggingId.value = null
}

const cancelOrFinishReorder = () => {
  if (!draggingId.value) return
  if (dropped.value) {
    draggingId.value = null
    return
  }
  localItems.value = [...props.items]
  draggingId.value = null
}

const startMouseDrag = (itemId: string, event: DragEvent) => {
  if (props.reorderDisabled || (event.target as HTMLElement).closest('button')) {
    event.preventDefault()
    return
  }
  beginReorder(itemId)
  event.dataTransfer?.setData('text/plain', itemId)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

const startTouchDrag = (itemId: string, event: PointerEvent) => {
  if (
    event.pointerType === 'mouse' ||
    props.reorderDisabled ||
    (event.target as HTMLElement).closest('button')
  )
    return
  beginReorder(itemId)
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const continueTouchDrag = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' || !draggingId.value) return
  const target = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest<HTMLElement>('[data-budget-item-id]')
  const targetId = target?.dataset.budgetItemId
  if (targetId) moveDraggedItem(targetId)
}

const finishTouchDrag = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' || !draggingId.value) return
  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
  finishReorder()
}

const cancelTouchDrag = (event: PointerEvent) => {
  if (event.pointerType === 'mouse') return
  cancelOrFinishReorder()
}

const moveWithKeyboard = (itemId: string, offset: -1 | 1) => {
  if (props.reorderDisabled) return
  const fromIndex = localItems.value.findIndex((item) => item.id === itemId)
  const toIndex = fromIndex + offset
  if (fromIndex < 0 || toIndex < 0 || toIndex >= localItems.value.length) return

  beginReorder(itemId)
  const targetItem = localItems.value[toIndex]
  if (!targetItem) return
  moveDraggedItem(targetItem.id)
  finishReorder()
}
</script>

<style scoped>
.reorder-progress {
  animation: reorder-progress 1.1s ease-in-out infinite;
}

@keyframes reorder-progress {
  from {
    transform: translateX(-110%);
  }
  to {
    transform: translateX(310%);
  }
}
</style>
