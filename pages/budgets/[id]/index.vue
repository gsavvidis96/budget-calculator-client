<template>
  <div class="page-wrapper">
    <div class="inner-wrapper d-flex flex-column flex-grow-1 ga-2">
      <v-progress-linear
        color="primary"
        indeterminate
        v-if="currentBudgetLoader"
      ></v-progress-linear>

      <template v-if="currentBudget">
        <v-btn
          size="x-small"
          variant="text"
          prepend-icon="mdi-chevron-left"
          class="align-self-start"
          to="/budgets"
          >Back to budgets</v-btn
        >

        <div class="d-flex flex-column flex-grow-1 ga-8">
          <budget-info />

          <div class="d-flex flex-column flex-md-row ga-12">
            <div class="d-flex flex-column flex-1 ga-6">
              <div class="d-flex justify-center align-center ga-2">
                <div class="text-h6 text-primary">Income</div>

                <v-btn
                  density="comfortable"
                  size="small"
                  icon="mdi-playlist-plus"
                  variant="elevated"
                  color="primary"
                  @click="dialog = { open: true, type: 'INCOME' }"
                />
              </div>

              <div class="d-flex flex-column">
                <budget-item-list type="INCOME" />
              </div>
            </div>

            <div class="d-flex flex-column flex-1 ga-6">
              <div class="d-flex justify-center align-center ga-2">
                <div class="text-h6 text-error">Expenses</div>

                <v-btn
                  density="comfortable"
                  size="small"
                  icon="mdi-playlist-plus"
                  variant="elevated"
                  color="error"
                  @click="dialog = { open: true, type: 'EXPENSES' }"
                />
              </div>

              <div class="d-flex flex-column">
                <budget-item-list type="EXPENSES" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <v-dialog v-model="dialog.open" :fullscreen="xs" maxWidth="600">
    <div class="dialog-card">
      <v-btn
        icon="mdi-close"
        class="ml-auto mb-1"
        density="comfortable"
        variant="text"
        @click="dialog.open = false"
        v-if="xs"
      />

      <budget-item-form
        :type="dialog.type!"
        :budget-id="(params.id as string)"
        @closeDialog="dialog.open = false"
      />
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import BudgetInfo from "./BudgetInfo.vue";
import BudgetItemList from "./BudgetItemList.vue";
import BudgetItemForm from "./BudgetItemForm.vue";
import { useDisplay } from "vuetify";

definePageMeta({
  middleware: "requires-auth",
});

const { params } = useRoute();
const { xs } = useDisplay();

const currentBudgetStore = useCurrentBudgetStore();

const { fetchCurrentBudget } = currentBudgetStore;

const { currentBudgetLoader, currentBudget } = storeToRefs(currentBudgetStore);

const dialog = ref<{
  open: boolean;
  type: "INCOME" | "EXPENSES" | null;
}>({
  open: false,
  type: null,
});

const onFetchCurrentBudget = async () => {
  try {
    const { id } = params;

    await fetchCurrentBudget(id as string);
  } catch (e) {
    navigateTo("/budgets");
  }
};

onFetchCurrentBudget();

onUnmounted(() => {
  currentBudget.value = null;
});
</script>

<style scoped lang="scss"></style>
