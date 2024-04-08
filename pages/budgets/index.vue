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
          v-model="search"
          :append-inner-icon="search ? 'mdi-close' : undefined"
          @click:append-inner="search = ''"
        />

        <v-badge color="primary" dot :model-value="sortBy !== DEFAULT_SORTBY">
          <v-btn
            :icon="xs ? 'mdi-sort' : undefined"
            :density="xs ? 'comfortable' : undefined"
            :size="xs ? 'small' : undefined"
            :prepend-icon="xs ? undefined : 'mdi-sort'"
            variant="text"
            id="sortby-menu"
          >
            <template v-slot:default v-if="!xs"> Sort by </template>
          </v-btn></v-badge
        >

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
        v-if="pending && !initialFetch"
      ></v-progress-linear>

      <div class="d-flex flex-column flex-grow-1 ga-4">
        <v-progress-circular
          color="primary"
          indeterminate
          class="ma-auto"
          size="90"
          width="5"
          v-if="pending && initialFetch"
        ></v-progress-circular>

        <template v-else>
          <div v-if="!error && !pending && data?.budgets?.length === 0">
            <v-alert
              :text="
                debouncedSearch ? 'No budgets found' : 'You have no budgets yet'
              "
              :type="debouncedSearch ? 'warning' : 'info'"
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
            v-for="budget in data?.budgets"
            :budget="budget"
            :key="budget.id"
            :refresh="refresh"
          />
        </template>
      </div>
    </div>
  </div>

  <v-dialog v-model="dialog" :fullscreen="xs">
    <div class="dialog-card align-self-center pa-5">
      <v-btn
        icon="mdi-close"
        class="ml-auto mb-1"
        density="comfortable"
        @click="dialog = false"
        variant="text"
        v-if="xs"
      />

      <budget-form :refresh="refresh" @closeDialog="dialog = false" />
    </div>
  </v-dialog>

  <v-menu activator="#sortby-menu" v-model="sortByMenu" :scrim="true">
    <div
      class="d-flex flex-column elevation-5 sortby-menu rounded overflow-hidden bg-background"
      @click.stop
    >
      <div
        v-for="sortItem in sortMenu"
        :key="sortItem.label"
        class="d-flex align-center ga-4 sortby-item pa-2"
        :class="{ active: sortBy === `${sortItem.value}:${sortItem.direcion}` }"
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
import { getJwt } from "~/helpers/getJwt";
import BudgetCard from "./BudgetCard.vue";
import { type BudgetListItem } from "@/helpers/types";
import BudgetForm from "./BudgetForm.vue";

const DEFAULT_SORTBY = "created_at:desc";

const sortMenu = [
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

const {
  public: { apiUrl },
} = useRuntimeConfig();

definePageMeta({
  middleware: "requires-auth",
});

const dialog = ref(false);
const initialFetch = ref(true);
const sortByMenu = ref(false);
const sortBy = ref(DEFAULT_SORTBY);
const search = ref("");
const debouncedSearch = ref("");

const { data, pending, error, refresh } = await useLazyFetch<{
  budgets: BudgetListItem[];
}>(`${apiUrl}/budgets`, {
  headers: {
    Authorization: `Bearer ${await getJwt()}`,
  },
  query: {
    sort: sortBy,
    search: debouncedSearch,
  },
  parseResponse: (r) => JSON.parse(r),
});

const onChangeSortBy = (newSortBy: string) => {
  sortBy.value = newSortBy;

  sortByMenu.value = false;
};

watch(
  search,
  useDebounceFn(() => {
    debouncedSearch.value = search.value;
  }, 500)
);

watch(data, () => {
  if (initialFetch.value) initialFetch.value = false;
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
