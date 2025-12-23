<template>
  <router-link :to="`/budgets/${budget.id}`" class="budget-card d-flex rounded pa-4 pa-sm-6 ga-2">
    <div class="d-flex flex-column ga-2 flex-grow-1 budget-info">
      <div class="budget-title text-body-1 font-weight-bold">
        {{ budget.title }}
      </div>

      <div class="d-flex align-center ga-2">
        <div class="text-body-2 font-weight-medium">Created at:</div>

        <div class="text-body-2 text-medium-emphasis">
          {{ $dayjs(budget.created_at).format('DD/MM/YYYY') }}
        </div>
      </div>

      <div class="d-flex align-center ga-2">
        <div class="text-body-2 font-weight-medium">Balance:</div>

        <div class="text-body-2 text-medium-emphasis" v-price="budget.balance" />
      </div>
    </div>

    <v-btn
      density="compact"
      icon
      variant="text"
      color="primary"
      @click.prevent="emit('edit-budget', budget)"
    >
      <v-icon size="20px" color="primary"> mdi-pencil-outline </v-icon>

      <v-tooltip activator="parent" location="bottom">Edit</v-tooltip>
    </v-btn>

    <v-btn
      density="compact"
      icon
      variant="text"
      color="primary"
      :loading="loader"
      @click.prevent="onTogglePin"
    >
      <v-icon size="20px" color="primary">
        {{ budget.is_pinned ? 'mdi-pin-off' : 'mdi-pin-outline' }}
      </v-icon>

      <v-tooltip activator="parent" location="bottom">{{
        budget.is_pinned ? 'Unpin' : 'Pin'
      }}</v-tooltip>
    </v-btn>

    <v-btn
      density="compact"
      icon
      variant="text"
      color="error"
      :id="`delete-menu-${budget.id}`"
      @click.prevent="emit('delete-budget', budget)"
    >
      <v-icon size="20px" color="error"> mdi-delete-outline </v-icon>

      <v-tooltip activator="parent" location="bottom">Delete</v-tooltip>
    </v-btn>
  </router-link>
</template>

<script setup lang="ts">
import type { BudgetListItem } from '@/types'

const { budget } = defineProps<{
  budget: BudgetListItem
}>()

const emit = defineEmits<{
  (e: 'edit-budget', budget: BudgetListItem): void
  (e: 'delete-budget', budget: BudgetListItem): void
}>()

const { openSnackbar } = useBaseStore()
const { getBudgets } = useBudgetsStore()

const loader = ref(false)

const onTogglePin = async () => {
  loader.value = true

  try {
    const { data: updatedBudget } = await apiClient.patch(`/budgets/${budget.id}`, {
      is_pinned: !budget.is_pinned,
    })

    await getBudgets({ refresh: true })

    openSnackbar({
      color: updatedBudget.is_pinned ? 'success' : 'warning',
      text: `Budget "${updatedBudget.title}" was ${updatedBudget.is_pinned ? 'pinned' : 'unpinned'}`,
    })
  } catch (e) {
    console.error(e)

    openSnackbar({
      color: 'error',
      text: 'Something went wrong.',
    })
  } finally {
    loader.value = false
  }
}
</script>

<style scoped lang="scss">
.budget-card {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-surface-light));
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: rgb(var(--v-theme-surface-light));
  }

  .budget-info {
    overflow-x: auto;
    white-space: nowrap;

    .budget-title {
      font-size: 20px !important;
    }
  }
}
</style>
