<template>
  <NuxtLink
    :to="`/budgets/${budget.id}`"
    class="d-flex budget-card rounded pa-4 pa-sm-6 ga-2"
  >
    <div class="d-flex flex-column ga-2 flex-grow-1 budget-info">
      <div class="text-h5 font-weight-bold capitalize-first-letter">
        {{ budget.title }}
      </div>

      <div class="d-flex align-center ga-2">
        <div class="text-body-2 font-weight-medium">Created at:</div>

        <div class="text-body-2 text-medium-emphasis">
          {{ $dayjs(budget.created_at).format("DD/MM/YYYY") }}
        </div>
      </div>

      <div class="d-flex align-center ga-2">
        <div class="text-body-2 font-weight-medium">Balance:</div>

        <div class="text-body-2 text-medium-emphasis">{{ balance }}€</div>
      </div>
    </div>

    <v-btn
      density="compact"
      variant="text"
      color="primary"
      icon
      @click.prevent="dialog = true"
    >
      <template v-slot:default>
        <v-icon size="20px">mdi-pencil-outline</v-icon>
      </template>
    </v-btn>

    <v-btn
      density="compact"
      variant="text"
      color="primary"
      icon
      @click.prevent="onTogglePin"
      :loading="loader"
    >
      <template v-slot:default>
        <v-icon size="20px">{{
          budget.is_pinned ? "mdi-pin-off" : "mdi-pin-outline"
        }}</v-icon>
      </template>
    </v-btn>

    <v-btn
      density="compact"
      variant="text"
      color="error"
      icon
      :id="`delete-menu-${budget.id}`"
      @click.prevent
    >
      <template v-slot:default>
        <v-icon size="20px">mdi-delete-outline</v-icon>
      </template>
    </v-btn>
  </NuxtLink>

  <v-menu
    :activator="`#delete-menu-${budget.id}`"
    v-model="deleteMenu"
    :scrim="true"
  >
    <div
      class="d-flex flex-column elevation-5 pa-3 ga-4 delete-menu rounded"
      @click.stop
    >
      <div class="text-subtitle-1 text-center">
        Are you sure you want to delete budget "<strong>{{
          trimmedTitle
        }}</strong
        >" ?
      </div>

      <div class="d-flex align-center justify-center ga-2">
        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="deleteMenu = false"
          >Cancel</v-btn
        >

        <v-btn
          color="error"
          size="small"
          :loading="deleteLoader"
          @click="onDelete"
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

      <budget-form :budget="budget" @closeDialog="dialog = false" />
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { getJwt } from "~/helpers/getJwt";
import BudgetForm from "./BudgetForm.vue";
import { trimText } from "~/helpers/trimText";
import { formatCurrency } from "@/helpers/formatCurrency";
import { capitalizeFirstLetter } from "~/helpers/capitalizeFirstLetter";

const { xs } = useDisplay();

const {
  public: { apiUrl },
} = useRuntimeConfig();

const props = defineProps<{
  budget: BudgetListItem;
}>();

const { openSnackbar } = useBaseStore();

const { budget } = toRefs(props);

const { fetchBudgets } = useBudgetsStore();

const trimmedTitle = computed(() =>
  trimText(capitalizeFirstLetter(budget.value.title), 20)
);
const balance = computed(() => formatCurrency(budget.value.balance));

const loader = ref(false);
const deleteMenu = ref(false);
const deleteLoader = ref(false);
const dialog = ref(false);

const onTogglePin = async () => {
  loader.value = true;

  try {
    const { is_pinned } = await $fetch<BudgetListItem>(
      `${apiUrl}/budgets/${budget.value.id}`,
      {
        method: "patch",
        body: {
          is_pinned: !budget.value.is_pinned,
        },
        headers: {
          Authorization: `Bearer ${await getJwt()}`,
        },
        parseResponse: (r) => JSON.parse(r),
      }
    );

    await fetchBudgets({ refresh: true });

    openSnackbar({
      open: true,
      color: is_pinned ? "success" : "warning",
      text: `Budget "${trimmedTitle.value}" was ${
        is_pinned ? "pinned" : "unpinned"
      }`,
    });
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

const onDelete = async () => {
  deleteLoader.value = true;

  try {
    await $fetch(`${apiUrl}/budgets/${budget.value.id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${await getJwt()}`,
      },
      parseResponse: (r) => JSON.parse(r),
    });

    await fetchBudgets({ refresh: true });

    openSnackbar({
      open: true,
      color: "warning",
      text: `Budget "${trimmedTitle.value}" was deleted.`,
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
    deleteLoader.value = false;
  }
};
</script>

<style scoped lang="scss">
.budget-card {
  cursor: pointer;
  border: 1px solid rgb(var(--v-theme-border));
  background-color: rgb(var(--v-theme-background1));
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: rgb(var(--v-theme-background3));
  }
}

.budget-info {
  overflow-x: auto;
  white-space: nowrap;
}

.delete-menu {
  background-color: rgb(var(--v-theme-background3));
}
</style>
