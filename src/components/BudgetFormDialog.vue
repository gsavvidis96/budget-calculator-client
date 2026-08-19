<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="budget ? 'Edit budget' : 'Create a budget'"
    :style="{ width: '30rem' }"
    :breakpoints="{ '640px': 'calc(100vw - 1.25rem)' }"
    :draggable="false"
  >
    <p class="mt-0 mb-6 text-base leading-7 text-neutral-500 dark:text-neutral-400">
      {{
        budget
          ? 'Update the name or keep this budget at the top of your list.'
          : 'Give this budget a clear name. You can add income and expenses next.'
      }}
    </p>

    <Form
      :key="formKey"
      v-slot="$form"
      :initial-values="initialValues"
      :resolver="resolver"
      :validate-on-value-update="true"
      :validate-on-blur="true"
      class="flex flex-col gap-5"
      @submit="submit"
    >
      <div class="flex flex-col gap-2">
        <label
          for="budget-title"
          class="text-base font-semibold text-neutral-700 dark:text-neutral-200"
          >Budget name</label
        >
        <InputText
          id="budget-title"
          name="title"
          fluid
          autofocus
          autocomplete="off"
          placeholder="e.g. September plan"
          :invalid="Boolean($form.title?.invalid || serverError)"
          @input="serverError = ''"
        />
        <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">{{
          $form.title.error?.message
        }}</Message>
        <Message v-else-if="serverError" severity="error" size="small" variant="simple">{{
          serverError
        }}</Message>
      </div>

      <label
        class="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700"
      >
        <span>
          <span class="block text-base font-semibold text-neutral-800 dark:text-neutral-100"
            >Pin this budget</span
          >
          <span class="mt-1 block text-xs text-neutral-500 dark:text-neutral-400"
            >Pinned budgets always appear first.</span
          >
        </span>
        <Checkbox name="is_pinned" binary />
      </label>

      <div class="mt-2 flex justify-end gap-3">
        <Button
          type="button"
          severity="secondary"
          text
          :disabled="mutation.isPending.value"
          @click="visible = false"
          >Cancel</Button
        >
        <Button
          type="submit"
          :disabled="
            mutation.isPending.value ||
            !$form.valid ||
            (Boolean(budget) && !$form.title?.dirty && !$form.is_pinned?.dirty)
          "
        >
          <Spinner v-if="mutation.isPending.value" class="size-4 animate-spin" aria-hidden="true" />
          <span>{{ budget ? 'Save changes' : 'Create budget' }}</span>
        </Button>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { Spinner } from '@primeicons/vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { createBudget, updateBudget } from '@/api/budgets'
import { budgetKeys } from '@/queries/budgets'
import { budgetSchema } from '@/schemas/budgets'
import type { BudgetInput, BudgetSummary } from '@/types'
import { getAppError } from '@/utils/errors'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  budget?: BudgetSummary | null
}>()

const visible = defineModel<boolean>({ required: true })
const emit = defineEmits<{
  saved: [budget: BudgetSummary]
}>()

const toast = useToast()
const queryClient = useQueryClient()
const serverError = ref('')

const resolver = zodResolver(budgetSchema)

const initialValues = computed<BudgetInput>(() => ({
  title: props.budget?.title ?? '',
  is_pinned: props.budget?.is_pinned ?? false,
}))
const formKey = computed(() => `${props.budget?.id ?? 'new'}-${visible.value}`)

const mutation = useMutation({
  mutationFn: (input: BudgetInput) =>
    props.budget ? updateBudget({ budgetId: props.budget.id, input }) : createBudget(input),
  onSuccess: async (savedBudget) => {
    await queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
    if (props.budget) {
      await queryClient.invalidateQueries({ queryKey: budgetKeys.detail(props.budget.id) })
    }

    toast.add({
      severity: 'success',
      summary: props.budget ? 'Budget updated' : 'Budget created',
      detail: `“${savedBudget.title}” was saved.`,
      life: 3500,
    })
    emit('saved', savedBudget)
    visible.value = false
  },
  onError: (error) => {
    const appError = getAppError(error)
    if (appError.status === 409) {
      serverError.value = 'A budget with this name already exists.'
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Could not save budget',
      detail: appError.message,
      life: 5000,
    })
  },
})

const submit = (event: FormSubmitEvent) => {
  if (!event.valid || mutation.isPending.value) return

  serverError.value = ''
  const values = budgetSchema.parse(event.values)
  mutation.mutate({
    title: values.title.trim(),
    is_pinned: values.is_pinned,
  })
}
</script>
