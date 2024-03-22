<template>
  <div class="page-wrapper">
    <div
      class="d-flex align-center pa-4 pa-sm-8 rounded inner-wrapper ga-3 ga-sm-6"
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
        />
      </template>

      <template v-else>
        <v-btn prepend-icon="mdi-sort" class="mr-auto" variant="text"
          >Sort by</v-btn
        >

        <v-btn prepend-icon="mdi-plus" color="primary">New</v-btn>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { getJwt } from "~/helpers/getJwt";

const { xs } = useDisplay();

const {
  public: { apiUrl },
} = useRuntimeConfig();

definePageMeta({
  middleware: "requires-auth",
});

const jwt = await getJwt();

const { data, pending, error } = await useFetch(`${apiUrl}/budgets`, {
  headers: {
    Authorization: `Bearer ${jwt}`,
  },
  parseResponse: (r) => JSON.parse(r),
});

console.log("data", data.value);
console.log("pending", pending.value);
console.log("error", error.value);
</script>

<style scoped>
.inner-wrapper {
  background-color: rgb(var(--v-theme-budgetCardBackground));
}

.search-field {
  width: 400px;
}
</style>
