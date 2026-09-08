<template>
  <InputGroup>
    <InputGroupAddon aria-hidden="true">€</InputGroupAddon>
    <InputText
      :id="inputId"
      :model-value="text"
      :form-control="{ novalidate: true }"
      :invalid="invalid"
      fluid
      inputmode="decimal"
      autocomplete="off"
      :spellcheck="false"
      placeholder="0.00"
      @update:model-value="onInput"
      @blur="emit('blur', $event)"
    />
  </InputGroup>
</template>

<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import { ref, watch } from 'vue'

const props = defineProps<{
  inputId: string
  modelValue?: number | null
  invalid?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  blur: [event: FocusEvent]
}>()

const text = ref(props.modelValue == null ? '' : String(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    // Preserve the user's text when the form echoes its parsed numeric value.
    if (value !== parseAmount(text.value)) text.value = value == null ? '' : String(value)
  },
)

function parseAmount(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/^€\s*|\s*€$/g, '')
    .replace(',', '.')
  return /^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized) ? Number(normalized) : null
}

function onInput(value: string | undefined) {
  text.value = value ?? ''
  emit('update:modelValue', parseAmount(text.value))
}
</script>
