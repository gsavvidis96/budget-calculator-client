<template>
  <div class="d-flex flex-column">
    <v-divider />

    <div class="d-flex align-center text-body-1 px-2 py-3 card-content ga-2">
      <div class="mr-auto text-capitalize card-title">
        {{ budgetItem.description }}
      </div>

      <div
        class="d-flex align-center ga-2"
        :class="budgetItem.type === 'INCOME' ? 'text-primary' : 'text-error'"
      >
        <v-chip
          size="small"
          v-if="budgetItem.type === 'EXPENSES' && currentBudget!.income_items.length"
        >
          {{ budgetItem.expense_percentage!.toFixed(2) }}%
        </v-chip>

        <div>{{ budgetItem.type === "INCOME" ? "+" : "-" }}{{ value }}€</div>

        <v-btn
          density="compact"
          variant="text"
          :color="budgetItem.type === 'INCOME' ? 'primary' : 'error'"
          icon
          @click="dialog = true"
        >
          <template v-slot:default>
            <v-icon size="20px">mdi-pencil-outline</v-icon>
          </template>
        </v-btn>

        <v-btn
          density="compact"
          variant="text"
          :color="budgetItem.type === 'INCOME' ? 'primary' : 'error'"
          icon
          :id="`delete-menu-${budgetItem.id}`"
        >
          <template v-slot:default>
            <v-icon size="20px">mdi-delete-outline</v-icon>
          </template>
        </v-btn>
      </div>
    </div>
  </div>

  <v-menu
    :activator="`#delete-menu-${budgetItem.id}`"
    v-model="deleteMenu"
    :scrim="true"
  >
    <div
      class="d-flex flex-column elevation-5 pa-3 ga-4 delete-menu rounded"
      @click.stop
    >
      <div class="text-subtitle-1 text-center">
        Are you sure you want to delete
        {{ budgetItem.type === "EXPENSES" ? "expense" : "income" }} "<strong>{{
          trimmedDescription
        }}</strong
        >" (<span
          class="text-body-2"
          :class="
            budgetItem.type === 'EXPENSES' ? 'text-error' : 'text-primary'
          "
          >{{ budgetItem.type === "EXPENSES" ? "-" : "+" }}{{ value }}€</span
        >) ?
      </div>

      <div class="d-flex align-center justify-center ga-2">
        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="deleteMenu = false"
          >Cancel</v-btn
        >

        <v-btn color="error" size="small" :loading="loader" @click="onDelete"
          >Delete</v-btn
        >
      </div>
    </div>
  </v-menu>

  <v-dialog v-model="dialog" :fullscreen="xs" maxWidth="600">
    <div class="dialog-card">
      <v-btn
        icon="mdi-close"
        class="ml-auto mb-1"
        density="comfortable"
        variant="text"
        @click="dialog = false"
        v-if="xs"
      />

      <budget-item-form
        :type="budgetItem.type"
        :budget-id="currentBudget!.id"
        :budget-item="budgetItem"
        @closeDialog="dialog = false"
      />
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { formatCurrency } from "~/helpers/formatCurrency";
import { useDisplay } from "vuetify";
import BudgetItemForm from "./BudgetItemForm.vue";
import { getJwt } from "~/helpers/getJwt";
import { trimText } from "~/helpers/trimText";

const props = defineProps<{
  budgetItem: BudgetItem;
}>();

const { budgetItem } = toRefs(props);

const { xs } = useDisplay();

const {
  public: { apiUrl },
} = useRuntimeConfig();

const { openSnackbar } = useBaseStore();

const budgetStore = useBudgetsStore();
const { budgetsFetched } = storeToRefs(budgetStore);

const currentBudgetStore = useCurrentBudgetStore();
const { fetchCurrentBudget } = currentBudgetStore;
const { currentBudget } = storeToRefs(currentBudgetStore);

const value = computed(() => formatCurrency(budgetItem.value.value));
const trimmedDescription = computed(() =>
  trimText(budgetItem.value.description, 20)
);

const dialog = ref(false);
const deleteMenu = ref(false);
const loader = ref(false);

const onDelete = async () => {
  loader.value = true;

  try {
    await $fetch(
      `${apiUrl}/budgets/${currentBudget.value!.id}/budget-items/${
        budgetItem.value.id
      }`,
      {
        method: "delete",
        headers: {
          Authorization: `Bearer ${await getJwt()}`,
        },
        parseResponse: (r) => JSON.parse(r),
      }
    );

    budgetsFetched.value = false;

    await fetchCurrentBudget(currentBudget.value!.id);

    openSnackbar({
      open: true,
      color: "warning",
      text: `${budgetItem.value.type === "EXPENSES" ? "Expense" : "Income"} "${
        trimmedDescription.value
      }" was deleted.`,
    });

    deleteMenu.value = false;
  } catch (e) {
    console.error(e);

    openSnackbar({
      open: true,
      color: "error",
      text: "Something went wrong.",
    });
  } finally {
    loader.value = false;
  }
};
</script>

<style scoped lang="scss">
.card-content {
  transition: all 0.2s;

  &:hover {
    background-color: rgb(var(--v-theme-background3));
  }
}

.card-title {
  white-space: nowrap;
  overflow-x: auto;
}

.delete-menu {
  background-color: rgb(var(--v-theme-background3));
}
</style>
