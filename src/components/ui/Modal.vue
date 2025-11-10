<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()
function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
    @click="onBackdrop"
    role="dialog"
    aria-modal="true"
  >
    <div class="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full p-6">
      <button class="float-right" @click="$emit('close')">✕</button>
      <div class="clear-both">
        <slot />
      </div>
    </div>
  </div>
</template>
