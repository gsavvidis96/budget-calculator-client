<template>
  <div>
    <h1>BUDGETS PAGE (CLIENT SIDE)</h1>
  </div>
</template>

<script setup lang="ts">
import { getJwt } from "~/helpers/getJwt";

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

<style scoped></style>
