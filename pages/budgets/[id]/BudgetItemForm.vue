<template>
  <form
    class="d-flex flex-column ga-4 flex-grow-1"
    @submit.prevent="onSubmit"
    novalidate
  >
    <div class="text-h6 align-self-center text-center">
      {{ Boolean(budgetItem) ? "Edit" : "Add" }}
      {{ type === "INCOME" ? "Income" : "Expense" }}
    </div>

    <v-text-field
      label="Description"
      variant="outlined"
      class="flex-grow-0"
      density="compact"
      :hide-details="!error"
      :error-messages="
        error
          ? `An ${
              type === 'INCOME' ? 'income' : 'expense'
            } with this description already exists`
          : ''
      "
      color="primary"
      v-model="description"
    />

    <v-text-field
      label="Value"
      variant="outlined"
      class="flex-grow-0"
      density="compact"
      hide-details
      color="primary"
      v-model.number="value"
      type="number"
      min="0"
      max="99999999.99"
      @focus="$event.target.select()"
    />

    <v-btn
      :color="disabled ? 'gray' : 'primary'"
      class="text-center mt-auto"
      :disabled="disabled"
      type="submit"
      :loading="loader"
      >{{ Boolean(budgetItem) ? "Save" : "Add" }}</v-btn
    >
  </form>
</template>

<script setup lang="ts">
import { capitalizeFirstLetter } from "~/helpers/capitalizeFirstLetter";
import { getJwt } from "~/helpers/getJwt";
import { trimText } from "~/helpers/trimText";

const {
  public: { apiUrl },
} = useRuntimeConfig();

const props = defineProps<{
  type: "INCOME" | "EXPENSES";
  budgetId: string;
  budgetItem?: BudgetItem;
}>();

const { type, budgetItem, budgetId } = toRefs(props);

const emit = defineEmits(["closeDialog"]);

const budgetStore = useBudgetsStore();

const { budgetsFetched } = storeToRefs(budgetStore);

const { fetchCurrentBudget } = useCurrentBudgetStore();

const { openSnackbar } = useBaseStore();

const description = ref(budgetItem.value?.description || "");
const value = ref(budgetItem.value?.value || 0);
const error = ref(false);
const loader = ref(false);
const initialValues = ref({
  description: description.value,
  value: value.value,
});

const trimmedDescription = computed(() =>
  trimText(capitalizeFirstLetter(description.value), 20)
);

const hasChanges = computed(
  () =>
    JSON.stringify(initialValues.value) !==
    JSON.stringify({
      description: description.value,
      value: value.value,
    })
);

const disabled = computed(
  () =>
    !hasChanges.value || !description.value || !value.value || value.value <= 0
);

const onSubmit = async () => {
  try {
    error.value = false;
    loader.value = true;

    await $fetch(
      `${apiUrl}/budgets/${budgetId.value}/budget-items${
        budgetItem.value ? "/" + budgetItem.value.id : ""
      }`,
      {
        method: budgetItem.value ? "patch" : "post",
        body: {
          description: description.value,
          value: value.value,
          type: type.value,
        },
        headers: {
          Authorization: `Bearer ${await getJwt()}`,
        },
        parseResponse: (r) => JSON.parse(r),
      }
    );

    budgetsFetched.value = false;

    await fetchCurrentBudget(budgetId.value);

    openSnackbar({
      open: true,
      color: "success",
      text: `${type.value === "INCOME" ? "Income" : "Expense"} "${
        trimmedDescription.value
      }" was ${Boolean(budgetItem.value) ? "updated" : "added"}.`,
    });

    emit("closeDialog");
  } catch (e: any) {
    if (
      e.status === 400 &&
      e?.response._data?.field?.includes("budget_id, type, description")
    ) {
      error.value = true;
    } else {
      console.error(e);

      openSnackbar({
        open: true,
        color: "error",
        text: "Something went wrong.",
      });
    }
  } finally {
    loader.value = false;
  }
};

watch(value, (newValue) => {
  if (!Boolean(newValue) || newValue <= 0) value.value = 0;

  if (newValue > 99999999.99) value.value = 99999999.99;
});
</script>

<style scoped></style>
