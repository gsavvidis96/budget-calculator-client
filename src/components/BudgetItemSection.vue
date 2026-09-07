<template>
  <section class="surface-card overflow-hidden rounded-2xl">
    <header
      class="flex items-center gap-3 border-b border-neutral-200 px-5 py-5 sm:gap-4 sm:px-6 dark:border-neutral-700/80"
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
      <div class="min-w-0">
        <h2 class="m-0 text-xl font-bold text-neutral-900 dark:text-white">
          {{ type === 'INCOME' ? 'Income' : 'Expenses' }}
        </h2>
        <p class="mt-0.5 mb-0 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
          {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
        </p>
        <button
          v-if="items.length > 1"
          data-mobile-reorder-toggle
          type="button"
          class="mt-1 block cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 text-xs font-bold text-neutral-500 underline decoration-neutral-400/60 underline-offset-2 transition-colors hover:text-neutral-800 disabled:opacity-40 sm:hidden dark:text-neutral-400 dark:hover:text-neutral-100"
          :class="
            mobileReorderMode
              ? type === 'INCOME'
                ? 'text-emerald-600 dark:text-emerald-300'
                : 'text-red-600 dark:text-red-300'
              : ''
          "
          :aria-label="mobileReorderMode ? 'Finish reordering items' : 'Reorder items'"
          :aria-pressed="mobileReorderMode"
          :disabled="reorderDisabled"
          @click="toggleMobileReorderMode"
        >
          {{ mobileReorderMode ? 'Done' : 'Reorder' }}
        </button>
      </div>
      <Button
        class="ml-auto shrink-0"
        :severity="type === 'EXPENSES' ? 'danger' : undefined"
        @click="emit('add')"
      >
        <Plus class="size-3.5" aria-hidden="true" />
        <span>Add</span>
      </Button>
    </header>

    <div
      v-if="mobileReorderMode"
      class="border-b border-neutral-200 bg-neutral-50 px-5 py-2 text-center text-xs font-semibold text-neutral-500 sm:hidden dark:border-neutral-700/80 dark:bg-neutral-800/50 dark:text-neutral-400"
      role="status"
    >
      Drag items to arrange
    </div>

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
        :aria-busy="checkingItemId === item.id"
        class="group relative flex cursor-grab items-center gap-2 px-5 py-4 transition-[background-color,opacity,transform] before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:opacity-0 before:transition-opacity hover:bg-neutral-100 hover:before:opacity-100 focus:bg-neutral-100 focus:outline-none focus:before:opacity-100 active:cursor-grabbing sm:gap-3 sm:px-6 sm:touch-auto dark:hover:bg-neutral-800/90 dark:focus:bg-neutral-800/90"
        :class="[
          type === 'INCOME' ? 'before:bg-emerald-500' : 'before:bg-red-500',
          type === 'EXPENSES' && item.is_checked ? 'bg-neutral-50/80 dark:bg-neutral-900/30' : '',
          draggingId === item.id ? 'z-10 opacity-55' : '',
          reordering ? 'pointer-events-none opacity-70' : '',
          mobileReorderMode ? 'touch-none bg-neutral-50/70 dark:bg-neutral-800/30' : 'touch-pan-y',
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
        <div
          v-if="type === 'EXPENSES'"
          data-no-drag
          class="flex size-7 shrink-0 items-center justify-center"
          @pointerdown.stop
          @click.stop
        >
          <Checkbox
            binary
            class="expense-checkbox"
            :model-value="Boolean(item.is_checked)"
            :disabled="checkDisabled"
            :aria-label="
              item.is_checked
                ? `Include ${item.description} in the balance`
                : `Exclude ${item.description} from the balance`
            "
            @update:model-value="emit('check', item, Boolean($event))"
          />
        </div>

        <div class="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
          <p
            class="m-0 min-w-0 flex-1 break-words text-base leading-5 font-bold"
            :class="
              type === 'EXPENSES' && item.is_checked
                ? 'text-neutral-400 line-through dark:text-neutral-500'
                : 'text-neutral-800 dark:text-neutral-100'
            "
          >
            {{ item.description }}
          </p>

          <div class="mt-1.5 flex shrink-0 items-center gap-2 sm:mt-0">
            <span
              v-if="type === 'EXPENSES' && item.expense_percentage !== undefined"
              class="inline-flex whitespace-nowrap items-center rounded-full border px-2 py-0.5 text-[0.7rem] leading-4 font-semibold"
              :class="
                item.is_checked
                  ? 'border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500'
                  : 'border-red-200/80 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300'
              "
            >
              {{ formatPercentage(item.expense_percentage) }}
            </span>
            <p
              class="money m-0 whitespace-nowrap text-base font-bold"
              :class="
                type === 'INCOME'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : item.is_checked
                    ? 'text-neutral-400 line-through dark:text-neutral-500'
                    : 'text-red-600 dark:text-red-400'
              "
            >
              {{ type === 'INCOME' ? '+' : '−' }}{{ formatCurrency(item.value) }}
            </p>
          </div>
        </div>

        <div
          class="flex shrink-0 items-center gap-0.5"
          :class="mobileReorderMode ? 'max-sm:hidden' : ''"
        >
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
import Checkbox from 'primevue/checkbox'
import { ref, watch } from 'vue'
import type { BudgetItem, BudgetItemType } from '@/types'
import { formatCurrency, formatPercentage } from '@/utils/format'

const props = defineProps<{
  type: BudgetItemType
  items: BudgetItem[]
  reordering?: boolean
  reorderDisabled?: boolean
  checkingItemId?: string | null
  checkDisabled?: boolean
}>()

const emit = defineEmits<{
  add: []
  edit: [item: BudgetItem]
  delete: [item: BudgetItem]
  check: [item: BudgetItem, checked: boolean]
  reorder: [type: BudgetItemType, itemIds: string[]]
}>()

const localItems = ref([...props.items])
const mobileReorderMode = ref(false)
const draggingId = ref<string | null>(null)
const initialOrder = ref<string[]>([])
const dropped = ref(false)

const toggleMobileReorderMode = () => {
  if (props.reorderDisabled) return
  mobileReorderMode.value = !mobileReorderMode.value
  if (!mobileReorderMode.value) cancelOrFinishReorder()
}

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
  if (props.reorderDisabled || isInteractiveTarget(event.target)) {
    event.preventDefault()
    return
  }
  beginReorder(itemId)
  event.dataTransfer?.setData('text/plain', itemId)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

const startTouchDrag = (itemId: string, event: PointerEvent) => {
  if (event.pointerType === 'mouse' || props.reorderDisabled || !mobileReorderMode.value) return
  beginReorder(itemId)
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && Boolean(target.closest('button, input, label, [data-no-drag]'))

const continueTouchDrag = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' || !draggingId.value) return
  const scrollEdge = 72
  if (event.clientY < scrollEdge) window.scrollBy(0, -10)
  if (event.clientY > window.innerHeight - scrollEdge) window.scrollBy(0, 10)

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
.expense-checkbox {
  --expense-checkbox-color: light-dark(var(--p-red-500), var(--p-red-400));
  --expense-checkbox-hover-color: light-dark(var(--p-red-600), var(--p-red-300));
  --p-checkbox-width: 1.25rem;
  --p-checkbox-height: 1.25rem;
  --p-checkbox-icon-size: 0.75rem;
  --p-checkbox-border-radius: 9999px;
  --p-checkbox-checked-background: var(--expense-checkbox-color);
  --p-checkbox-checked-border-color: var(--expense-checkbox-color);
  --p-checkbox-checked-focus-border-color: var(--expense-checkbox-color);
  --p-checkbox-checked-hover-background: var(--expense-checkbox-hover-color);
  --p-checkbox-checked-hover-border-color: var(--expense-checkbox-hover-color);
  --p-checkbox-focus-ring-color: color-mix(in srgb, var(--expense-checkbox-color), transparent 75%);
}

@media (min-width: 640px) {
  .expense-checkbox {
    --p-checkbox-width: 1.5rem;
    --p-checkbox-height: 1.5rem;
    --p-checkbox-icon-size: 0.875rem;
  }
}

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
