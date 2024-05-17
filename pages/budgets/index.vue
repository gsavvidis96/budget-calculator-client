<template>
  <div class="page-wrapper">
    <div class="inner-wrapper d-flex flex-column flex-grow-1 ga-4">
      <div
        class="d-flex align-center pa-4 pa-sm-8 rounded ga-3 ga-sm-6 filters"
      >
        <v-text-field
          label="Search by name"
          variant="outlined"
          class="flex-md-grow-0 search-field"
          density="compact"
          hide-details
          color="primary"
          v-model="searchInput"
          :append-inner-icon="searchInput ? 'mdi-close' : undefined"
          @click:append-inner="searchInput = ''"
        />

        <v-badge color="primary" dot :model-value="sort !== DEFAULT_SORTBY">
          <v-btn
            :icon="xs ? 'mdi-sort' : undefined"
            :density="xs ? 'comfortable' : undefined"
            :size="xs ? 'small' : undefined"
            :prepend-icon="xs ? undefined : 'mdi-sort'"
            variant="text"
            id="sortby-menu"
          >
            <template v-slot:default v-if="!xs"> Sort by </template>
          </v-btn>
        </v-badge>

        <v-btn
          :icon="xs ? 'mdi-plus' : undefined"
          :density="xs ? 'comfortable' : undefined"
          :size="xs ? 'small' : undefined"
          :prepend-icon="xs ? undefined : 'mdi-plus'"
          id="sortby-menu"
          color="primary"
          class="ml-auto"
          @click="dialog = true"
        >
          <template v-slot:default v-if="!xs"> New </template>
        </v-btn>
      </div>

      <v-progress-linear
        color="primary"
        indeterminate
        v-if="budgetsLoader"
      ></v-progress-linear>

      <div class="d-flex flex-column flex-grow-1 ga-4">
        <div
          v-if="
            !error && !budgetsLoader && budgetsResponse?.budgets?.length === 0
          "
        >
          <v-alert
            :text="search ? 'No budgets found' : 'You have no budgets yet'"
            :type="search ? 'warning' : 'info'"
            variant="tonal"
          ></v-alert>
        </div>

        <div v-if="error">
          <v-alert
            text="Couldn't fetch budgets"
            type="error"
            variant="tonal"
          ></v-alert>
        </div>

        <budget-card
          v-if="!error"
          v-for="budget in budgetsResponse?.budgets"
          :budget="budget"
          :key="budget.id"
        />
      </div>
    </div>
  </div>

  <v-dialog v-model="dialog" :fullscreen="xs" maxWidth="600">
    <div class="dialog-card">
      <v-btn
        icon="mdi-close"
        class="ml-auto mb-1"
        density="comfortable"
        @click="dialog = false"
        variant="text"
        v-if="xs"
      />

      <budget-form @closeDialog="dialog = false" />
    </div>
  </v-dialog>

  <v-menu activator="#sortby-menu" v-model="sortMenu" :scrim="true">
    <div
      class="d-flex flex-column elevation-5 sortby-menu rounded overflow-hidden bg-background"
      @click.stop
    >
      <div
        v-for="sortItem in sortMenuItems"
        :key="sortItem.label"
        class="d-flex align-center ga-4 sortby-item pa-2"
        :class="{ active: sort === `${sortItem.value}:${sortItem.direcion}` }"
        @click="onChangeSortBy(`${sortItem.value}:${sortItem.direcion}`)"
      >
        <div class="text-subtitle-1">{{ sortItem.label }}</div>

        <v-chip
          size="small"
          v-if="sortItem.isDefault"
          variant="outlined"
          class="font-weight-medium"
        >
          Default
        </v-chip>
      </div>
    </div>
  </v-menu>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import BudgetCard from "./BudgetCard.vue";
import BudgetForm from "./BudgetForm.vue";

const sortMenuItems = [
  {
    label: "Creation Date (DESC)",
    isDefault: true,
    value: "created_at",
    direcion: "desc",
  },
  {
    label: "Creation Date (ASC)",
    isDefault: false,
    value: "created_at",
    direcion: "asc",
  },
  {
    label: "Balance (DESC)",
    isDefault: false,
    value: "balance",
    direcion: "desc",
  },
  {
    label: "Balance (ASC)",
    isDefault: false,
    value: "balance",
    direcion: "asc",
  },
];

const { xs } = useDisplay();

definePageMeta({
  middleware: "requires-auth",
});

const budgetStore = useBudgetsStore();

const { fetchBudgets } = budgetStore;

const { sort, search, budgetsResponse, budgetsLoader } =
  storeToRefs(budgetStore);

const dialog = ref(false);
const sortMenu = ref(false);
const searchInput = ref("");
const error = ref(false);

const onFetchBudgets = async ({ refresh = false } = {}) => {
  try {
    await fetchBudgets({ refresh });
  } catch (e) {
    console.error(e);

    error.value = true;
  }
};

onMounted(() => {
  onFetchBudgets();
});

const onChangeSortBy = (newSort: string) => {
  sort.value = newSort;

  sortMenu.value = false;
};

watch(
  searchInput,
  useDebounceFn(() => {
    search.value = searchInput.value;
  }, 500)
);

watch([search, sort], () => {
  onFetchBudgets({ refresh: true });
});
</script>

<style scoped lang="scss">
.filters {
  background-color: rgb(var(--v-theme-background3));
}

.search-field {
  width: 400px;
}

.sortby-menu {
  background-color: rgb(var(--v-theme-background1));

  .sortby-item {
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: rgb(var(--v-theme-background3));
    }

    &.active {
      background-color: rgb(var(--v-theme-primary));
      color: white;
    }
  }
}
</style>
