<template>
  <v-dialog max-width="500" v-model="model" :fullscreen="xs">
    <v-card elevation="0" class="pa-5 d-flex flex-column bg-surface-light">
      <v-btn density="compact" icon variant="text" class="mr-auto" @click="emit('close-dialog')">
        <v-icon> mdi-close</v-icon>
      </v-btn>

      <slot />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>()

const emit = defineEmits(['close-dialog'])

const { xs } = useDisplay()
</script>

<style scoped></style>
