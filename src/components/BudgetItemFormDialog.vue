<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="`${item ? 'Edit' : 'Add'} ${type === 'INCOME' ? 'income' : 'expense'}`"
    :style="{ width: '30rem' }"
    :breakpoints="{ '640px': 'calc(100vw - 1.25rem)' }"
    :draggable="false"
  >
    <p class="mt-0 mb-6 text-base leading-7 text-neutral-500 dark:text-neutral-400">
      {{
        type === 'INCOME'
          ? 'Add money coming into this budget.'
          : 'Track where money is going in this budget.'
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
          for="item-description"
          class="text-base font-semibold text-neutral-700 dark:text-neutral-200"
          >Description</label
        >
        <InputText
          id="item-description"
          name="description"
          fluid
          autofocus
          autocomplete="off"
          :placeholder="type === 'INCOME' ? 'e.g. Salary' : 'e.g. Rent'"
          :invalid="Boolean($form.description?.invalid || serverError)"
          @input="serverError = ''"
        />
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{
          $form.description.error?.message
        }}</Message>
        <Message v-else-if="serverError" severity="error" size="small" variant="simple">{{
          serverError
        }}</Message>
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="item-value"
          class="text-base font-semibold text-neutral-700 dark:text-neutral-200"
          >Amount</label
        >
        <InputNumber
          input-id="item-value"
          name="value"
          fluid
          mode="currency"
          currency="EUR"
          locale="en-US"
          :min="0"
          :max="99999999.99"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          :invalid="Boolean($form.value?.invalid)"
        />
        <Message v-if="$form.value?.invalid" severity="error" size="small" variant="simple">{{
          $form.value.error?.message
        }}</Message>
      </div>

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
          :severity="type === 'EXPENSES' ? 'danger' : undefined"
          :disabled="
            mutation.isPending.value ||
            !$form.valid ||
            (Boolean(item) && !$form.description?.dirty && !$form.value?.dirty)
          "
        >
          <Spinner v-if="mutation.isPending.value" class="size-4 animate-spin" aria-hidden="true" />
          <span>{{
            item ? 'Save changes' : `Add ${type === 'INCOME' ? 'income' : 'expense'}`
          }}</span>
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
import { createBudgetItem, updateBudgetItem } from '@/api/budgets'
import { budgetKeys } from '@/queries/budgets'
import { budgetItemSchema, type BudgetItemFormValues } from '@/schemas/budgets'
import type { BudgetItem, BudgetItemInput, BudgetItemType } from '@/types'
import { getAppError } from '@/utils/errors'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  budgetId: string
  type: BudgetItemType
  item?: BudgetItem | null
}>()

const visible = defineModel<boolean>({ required: true })
const toast = useToast()
const queryClient = useQueryClient()
const serverError = ref('')

const resolver = zodResolver(budgetItemSchema)

const initialValues = computed<BudgetItemFormValues>(() => ({
  description: props.item?.description ?? '',
  value: props.item?.value ?? 0,
}))
const formKey = computed(() => `${props.item?.id ?? 'new'}-${props.type}-${visible.value}`)

const mutation = useMutation({
  mutationFn: (input: BudgetItemInput) =>
    props.item
      ? updateBudgetItem({ budgetId: props.budgetId, itemId: props.item.id, input })
      : createBudgetItem({ budgetId: props.budgetId, input }),
  onSuccess: async (savedItem) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(props.budgetId) }),
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() }),
    ])

    const label = props.type === 'INCOME' ? 'Income' : 'Expense'
    toast.add({
      severity: 'success',
      summary: `${label} ${props.item ? 'updated' : 'added'}`,
      detail: `“${savedItem.description}” was saved.`,
      life: 3500,
    })
    visible.value = false
  },
  onError: (error) => {
    const appError = getAppError(error)
    if (appError.status === 409) {
      serverError.value = `This ${props.type === 'INCOME' ? 'income' : 'expense'} already exists.`
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Could not save item',
      detail: appError.message,
      life: 5000,
    })
  },
})

const submit = (event: FormSubmitEvent) => {
  if (!event.valid || mutation.isPending.value) return

  serverError.value = ''
  const values = budgetItemSchema.parse(event.values)
  mutation.mutate({
    description: values.description.trim(),
    value: values.value,
    type: props.type,
  })
}
</script>
