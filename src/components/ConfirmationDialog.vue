<template>
  <v-dialog max-width="500" v-model="model">
    <v-card elevation="0" class="pa-5 d-flex flex-column align-center ga-5 bg-surface-light">
      <div class="text-body-1 text-center font-weight-medium">{{ title }}</div>

      <div class="d-flex align-center ga-2">
        <v-btn variant="text" @click="emit('cancel')"> Cancel </v-btn>

        <v-btn color="primary" @click="emit('confirm')"> Logout </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>()

const { title } = defineProps<{
  title: string
}>()

const emit = defineEmits(['cancel', 'confirm'])
</script>

<style scoped></style>
