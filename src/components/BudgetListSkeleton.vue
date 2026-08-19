<template>
  <div
    class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    aria-label="Loading budgets"
    aria-busy="true"
  >
    <div v-for="index in 6" :key="index" class="surface-card rounded-2xl p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <Skeleton width="55%" height="1.25rem" />
          <Skeleton class="mt-3" width="35%" height="0.8rem" />
        </div>
        <Skeleton shape="circle" size="2.25rem" />
      </div>
      <Skeleton class="mt-10" width="70%" height="2.25rem" />
      <Skeleton class="mt-5" width="45%" height="0.8rem" />
    </div>
  </div>
</template>
