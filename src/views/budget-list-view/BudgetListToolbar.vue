<template>
  <div class="bg-surface-light d-flex align-center pa-4 pa-sm-8 rounded ga-3">
    <v-text-field
      label="Search by name"
      variant="outlined"
      class="flex-md-grow-0 search-field"
      density="compact"
      hide-details
      color="primary"
      v-model="searchInput"
    >
      <template #append-inner>
        <v-icon v-if="searchInput" icon="mdi-close" color="primary" @click="searchInput = ''" />
      </template>
    </v-text-field>

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
      color="primary"
      class="ml-auto"
      @click="dialog = true"
    >
      <template v-slot:default v-if="!xs"> New </template>
    </v-btn>
  </div>

  <v-menu activator="#sortby-menu" v-model="sortMenu" :scrim="true">
    <div class="d-flex flex-column elevation-5 rounded overflow-hidden bg-background" @click.stop>
      <div
        v-for="sortItem in sortMenuItems"
        :key="sortItem.label"
        class="d-flex align-center ga-4 sortby-item pa-2"
        :class="{ active: sort === `${sortItem.value}:${sortItem.direcion}` }"
        @click="onChangeSortBy(`${sortItem.value}:${sortItem.direcion}`)"
      >
        <div class="text-body-2 text-sm-body-1">{{ sortItem.label }}</div>

        <v-chip
          :size="smAndUp ? 'small' : 'x-small'"
          v-if="sortItem.isDefault"
          variant="outlined"
          class="font-weight-medium"
        >
          Default
        </v-chip>
      </div>
    </div>
  </v-menu>

  <FormDialog v-model="dialog" @close-dialog="dialog = false">
    <BudgetForm @close-dialog="dialog = false" />
  </FormDialog>
</template>

<script setup lang="ts">
import { DEFAULT_SORTBY } from '@/constants'

const { xs, smAndUp } = useDisplay()

const budgetStore = useBudgetsStore()

const { search, sort } = storeToRefs(budgetStore)

const sortMenuItems = [
  {
    label: 'Creation Date (DESC)',
    isDefault: true,
    value: 'created_at',
    direcion: 'desc',
  },
  {
    label: 'Creation Date (ASC)',
    isDefault: false,
    value: 'created_at',
    direcion: 'asc',
  },
  {
    label: 'Balance (DESC)',
    isDefault: false,
    value: 'balance',
    direcion: 'desc',
  },
  {
    label: 'Balance (ASC)',
    isDefault: false,
    value: 'balance',
    direcion: 'asc',
  },
]

const searchInput = ref('')
const sortMenu = ref(false)
const dialog = ref(false)

const onChangeSortBy = (newSort: string) => {
  sort.value = newSort

  sortMenu.value = false
}

watch(
  searchInput,
  useDebounceFn(() => {
    search.value = searchInput.value
  }, 500),
)
</script>

<style scoped lang="scss">
.search-field {
  width: 400px;
}

.sortby-item {
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgb(var(--v-theme-surface));
  }

  &.active {
    background-color: rgb(var(--v-theme-primary));
    color: white;
  }
}
</style>
