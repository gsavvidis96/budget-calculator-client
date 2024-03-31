<template>
  <form class="d-flex flex-column ga-4 flex-grow-1" @submit.prevent="onSubmit">
    <div class="text-h6 text-center align-self-center">
      {{ Boolean(budget) ? "Edit" : "Add new" }} budget
    </div>

    <v-text-field
      label="Title"
      variant="outlined"
      class="flex-grow-0"
      density="compact"
      :hide-details="!error"
      :error-messages="error ? 'A budget with this title already exists' : ''"
      color="primary"
      v-model="title"
    />

    <v-checkbox-btn
      v-model="is_pinned"
      label="Pinned"
      color="primary"
      :ripple="false"
      density="compact"
      class="ga-2 flex-grow-0"
    ></v-checkbox-btn>

    <v-btn
      :color="!hasChanges ? 'gray' : 'primary'"
      class="text-center mt-auto"
      :disabled="!hasChanges"
      type="submit"
      :loading="loader"
      >{{ Boolean(budget) ? "Save" : "Add" }}</v-btn
    >
  </form>
</template>

<script setup lang="ts">
import { getJwt } from "~/helpers/getJwt";
import type { BudgetListItem } from "~/helpers/types";

const {
  public: { apiUrl },
} = useRuntimeConfig();

const props = defineProps<{
  budget?: BudgetListItem;
  refresh: Function;
}>();

const emit = defineEmits(["closeDialog"]);

const { openSnackbar } = useBaseStore();

const { budget, refresh } = toRefs(props);

const title = ref(budget.value?.title || "");
const is_pinned = ref(budget.value?.is_pinned || false);
const initialValues = ref({
  title: title.value,
  is_pinned: is_pinned.value,
});
const loader = ref(false);
const error = ref(false);

const hasChanges = computed(
  () =>
    JSON.stringify(initialValues.value) !==
    JSON.stringify({
      title: title.value,
      is_pinned: is_pinned.value,
    })
);

const onSubmit = async () => {
  error.value = false;
  loader.value = true;

  try {
    const jwt = await getJwt();

    await $fetch<BudgetListItem>(
      `${apiUrl}/budgets${budget.value ? "/" + budget.value.id : ""}`,
      {
        method: budget.value ? "patch" : "post",
        body: {
          title: title.value,
          is_pinned: is_pinned.value,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        parseResponse: (r) => JSON.parse(r),
      }
    );

    await refresh.value();

    openSnackbar({
      open: true,
      color: "success",
      text: `Budget "${title.value}" was ${
        Boolean(budget.value) ? "updated" : "added"
      }.`,
    });

    emit("closeDialog");
  } catch (e: any) {
    if (e?.status === 400 && e?.response?._data.field?.includes("title")) {
      error.value = true;
    } else {
      console.error(e);

      openSnackbar({
        open: true,
        color: "error",
        text: "Something went wrong.",
      });
    }
  }

  loader.value = false;
};
</script>

<style scoped></style>
