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
        />

        <template v-if="xs">
          <v-btn
            icon="mdi-sort"
            density="comfortable"
            size="small"
            variant="text"
          />

          <v-btn
            icon="mdi-plus"
            density="comfortable"
            size="small"
            color="primary"
            @click="dialog = true"
          />
        </template>

        <template v-else>
          <v-btn prepend-icon="mdi-sort" class="mr-auto" variant="text"
            >Sort by</v-btn
          >

          <v-btn prepend-icon="mdi-plus" color="primary" @click="dialog = true"
            >New</v-btn
          >
        </template>
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
          <div v-if="data?.budgets?.length === 0">
            <v-alert
              text="You have no budgets yet"
              type="info"
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

  <v-dialog v-model="dialog" width="auto" :fullscreen="xs">
    <div class="dialog-card align-self-center pa-5">
      <v-btn
        icon="mdi-close"
        class="ml-auto mb-1"
        density="comfortable"
        @click="dialog = false"
        v-if="xs"
      />

      <budget-form :refresh="refresh" @closeDialog="dialog = false" />
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { getJwt } from "~/helpers/getJwt";
import BudgetCard from "./BudgetCard.vue";
import { type BudgetListItem } from "@/helpers/types";
import BudgetForm from "./BudgetForm.vue";

const { xs } = useDisplay();

const {
  public: { apiUrl },
} = useRuntimeConfig();

definePageMeta({
  middleware: "requires-auth",
});

const dialog = ref(false);
const initialFetch = ref(true);

const jwt = await getJwt();

const { data, pending, error, refresh } = await useLazyFetch<{
  budgets: BudgetListItem[];
}>(`${apiUrl}/budgets`, {
  headers: {
    Authorization: `Bearer ${jwt}`,
  },
  parseResponse: (r) => JSON.parse(r),
});

onMounted(() => {
  watch(data, () => {
    if (initialFetch.value) initialFetch.value = false;
  });
});
</script>

<style scoped>
.filters {
  background-color: rgb(var(--v-theme-budgetCardBackground));
}

.search-field {
  width: 400px;
}
</style>
