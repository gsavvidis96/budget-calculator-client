<template>
  <form class="d-flex flex-column ga-5" @submit="onSubmit" novalidate>
    <div class="text-h6 text-center align-self-center">
      {{ Boolean(budget) ? 'Edit' : 'Add new' }} budget
    </div>

    <v-text-field
      label="Title"
      variant="outlined"
      class="flex-grow-0"
      density="compact"
      color="primary"
      hide-details="auto"
      :error-messages="errors.title"
      v-model="title"
    />

    <v-checkbox-btn
      v-model="is_pinned"
      label="Pinned"
      color="primary"
      :ripple="false"
      density="compact"
      class="ga-2 flex-grow-0"
    />

    <v-btn
      :disabled="disabled"
      color="primary"
      class="text-center mt-auto"
      type="submit"
      :loading="loader"
      >{{ Boolean(budget) ? 'Save' : 'Add' }}</v-btn
    >
  </form>
</template>

<script setup lang="ts">
import type { BudgetListItem } from '@/types'
import { toTypedSchema } from '@vee-validate/zod'

const { budget } = defineProps<{
  budget?: BudgetListItem
}>()

const emit = defineEmits(['close-dialog'])

const { openSnackbar } = useBaseStore()

const { getBudgets } = useBudgetsStore()

const { errors, meta, defineField, handleSubmit, setFieldError } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      title: zod.string().trim().min(1),
      is_pinned: zod.boolean(),
    }),
  ),
  initialValues: {
    title: budget?.title || '',
    is_pinned: budget?.is_pinned || false,
  },
})

const [title] = defineField('title')
const [is_pinned] = defineField('is_pinned')

const loader = ref(false)

const disabled = computed(() => !meta.value.dirty || !meta.value.valid)

const onSubmit = handleSubmit(async (values) => {
  loader.value = true

  try {
    const { data: createdBudget } = await apiClient({
      method: budget ? 'patch' : 'post',
      url: `/budgets${budget ? '/' + budget.id : ''}`,
      data: {
        title: values.title,
        is_pinned: values.is_pinned,
      },
    })

    await getBudgets({ refresh: true })

    openSnackbar({
      color: 'success',
      text: `Budget "${createdBudget.title}" was ${Boolean(budget) ? 'updated' : 'added'}.`,
    })

    emit('close-dialog')
  } catch (e) {
    if (e?.status === 409) {
      setFieldError('title', 'Budget already exists')
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
