<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  content: string
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="border-t border-neutral-800 py-4">
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between text-left group"
    >
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <span class="text-white group-hover:text-neutral-300 transition-colors">▶</span> {{ title }}
      </h3>
    </button>

    <div v-show="isOpen" class="mt-4 text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
      {{ content }}
    </div>
  </div>
</template>

<style scoped>
button h3 span {
  font-size: 0.8em;
  transition: transform 0.2s;
}
</style>
