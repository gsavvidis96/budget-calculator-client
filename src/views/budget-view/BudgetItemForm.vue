<template>
  <form class="d-flex flex-column ga-5" novalidate @submit="onSubmit">
    <div class="text-h6 align-self-center text-center">
      {{ Boolean(budgetItem) ? 'Edit' : 'Add' }}
      {{ type === 'INCOME' ? 'Income' : 'Expense' }}
    </div>

    <v-text-field
      label="Description"
      variant="outlined"
      class="flex-grow-0"
      density="compact"
      color="primary"
      hide-details="auto"
      :error-messages="errors.description"
      v-model="description"
    />

    <v-text-field
      label="Value"
      variant="outlined"
      class="flex-grow-0"
      density="compact"
      color="primary"
      hide-details="auto"
      type="number"
      min="0"
      v-model.number="value"
      @focus="$event.target.select()"
    />

    <v-btn
      color="primary"
      class="text-center mt-auto"
      type="submit"
      :loading="loader"
      :disabled="disabled"
      >{{ Boolean(budgetItem) ? 'Save' : 'Add' }}</v-btn
    >
  </form>
</template>

<script setup lang="ts">
import type { BudgetItem } from '@/types'
import { toTypedSchema } from '@vee-validate/zod'

const { budgetItem, budgetId, type } = defineProps<{
  budgetItem?: BudgetItem
  budgetId: string
  type: 'INCOME' | 'EXPENSES'
}>()

const emit = defineEmits(['close-dialog'])

const budgetStore = useBudgetsStore()

const { getBudgetById } = budgetStore

const { budgetsFetched } = storeToRefs(budgetStore)

const { openSnackbar } = useBaseStore()

const { errors, meta, defineField, handleSubmit, setFieldError } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      description: zod.string().trim().min(1),
      value: zod.number().min(1),
    }),
  ),
  initialValues: {
    description: budgetItem?.description || '',
    value: budgetItem?.value || 0,
  },
})

const [description] = defineField('description')
const [value] = defineField('value')

const loader = ref(false)

const disabled = computed(() => !meta.value.dirty || !meta.value.valid)

const onSubmit = handleSubmit(async (values) => {
  try {
    loader.value = true

    const { data: createdBudgetItem } = await apiClient({
      method: budgetItem ? 'patch' : 'post',
      url: `/budgets/${budgetId}/budget-items${budgetItem ? '/' + budgetItem.id : ''}`,
      data: {
        description: values.description,
        value: values.value,
        type,
      },
    })

    budgetsFetched.value = false

    await getBudgetById(budgetId)

    openSnackbar({
      color: 'success',
      text: `${type === 'INCOME' ? 'Income' : 'Expense'} "${
        createdBudgetItem.description
      }" was ${Boolean(budgetItem) ? 'updated' : 'added'}.`,
    })

    emit('close-dialog')
  } catch (e) {
    if (e?.status === 409) {
      setFieldError(
        'description',
        `An ${type === 'INCOME' ? 'income' : 'expense'} with this description already exists`,
      )
    } else {
      console.error(e)

      openSnackbar({
        color: 'error',
        text: 'Something went wrong.',
      })
    }
  } finally {
    loader.value = false
  }
})
</script>

<style scoped></style>
