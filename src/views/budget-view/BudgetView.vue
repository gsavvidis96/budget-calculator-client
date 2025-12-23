<template>
  <div class="page-wrapper">
    <v-container class="page-container ga-5">
      <v-progress-linear color="primary" indeterminate v-if="currentBudgetLoader" />

      <template v-if="currentBudget">
        <v-btn
          size="small"
          variant="text"
          prepend-icon="mdi-chevron-left"
          class="align-self-start"
          to="/budgets"
          >Back to budgets</v-btn
        >

        <div class="d-flex flex-column flex-grow-1 ga-8">
          <BudgetInfo />

          <div class="d-flex flex-column flex-md-row ga-12">
            <div class="d-flex flex-column flex-1 ga-6" :class="{ 'overflow-x-hidden': mdAndUp }">
              <div class="d-flex justify-center align-center ga-2">
                <div class="text-h6 text-primary">Income</div>

                <v-btn
                  density="comfortable"
                  size="small"
                  icon="mdi-playlist-plus"
                  color="primary"
                  @click="dialog = { open: true, type: 'INCOME' }"
                />
              </div>

              <div class="d-flex flex-column">
                <BudgetItemList type="INCOME" />
              </div>
            </div>

            <div class="d-flex flex-column flex-1 ga-6" :class="{ 'overflow-x-hidden': mdAndUp }">
              <div class="d-flex justify-center align-center ga-2">
                <div class="text-h6 text-error">Expenses</div>

                <v-btn
                  density="comfortable"
                  size="small"
                  icon="mdi-playlist-plus"
                  color="error"
                  @click="dialog = { open: true, type: 'EXPENSES' }"
                />
              </div>

              <div class="d-flex flex-column">
                <BudgetItemList type="EXPENSES" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </v-container>

    <FormDialog v-model="dialog.open" @close-dialog="dialog.open = false">
      <BudgetItemForm
        @close-dialog="dialog.open = false"
        :budget-id="currentBudget!.id"
        :type="dialog.type!"
      />
    </FormDialog>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { mdAndUp } = useDisplay()

const budgetStore = useBudgetsStore()

const { getBudgetById } = budgetStore

const { currentBudget, currentBudgetLoader } = storeToRefs(budgetStore)

const dialog = ref<{
  open: boolean
  type: 'INCOME' | 'EXPENSES' | null
}>({
  open: false,
  type: null,
})

onMounted(async () => {
  const { id } = route.params

  try {
    await getBudgetById(id as string)
  } catch {
    router.replace('/budgets')
  }
})

onUnmounted(() => {
  currentBudget.value = null
})
</script>

<style scoped></style>
