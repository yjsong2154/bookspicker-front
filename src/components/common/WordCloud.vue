<script setup lang="ts">
import { computed } from 'vue'

interface Word {
  text: string
  value: number
}

const props = withDefaults(defineProps<{
  words: Word[]
  maxFontSize?: number
  minFontSize?: number
}>(), {
  maxFontSize: 15,
  minFontSize: 5
})

// Pastel/Neon colors for dark theme
const colors = [
  '#FF79C6', // Pink
  '#BD93F9', // Purple
  '#8BE9FD', // Cyan
  '#50FA7B', // Green
  '#FFB86C', // Orange
  '#F1FA8C', // Yellow
  '#FF5555', // Red
]

const normalizedWords = computed(() => {
  if (props.words.length === 0) return []
  
  // Randomly select half of the words
  const shuffled = [...props.words].sort(() => 0.5 - Math.random())
  const selectedWords = shuffled.slice(0, Math.ceil(props.words.length / 2))

  const maxVal = Math.max(...selectedWords.map(w => w.value))
  const minVal = Math.min(...selectedWords.map(w => w.value))
  const range = maxVal - minVal || 1

  return selectedWords.map((w, i) => ({
    text: w.text,
    size: props.minFontSize + ((w.value - minVal) / range) * (props.maxFontSize - props.minFontSize),
    color: colors[i % colors.length],
    rotation: Math.random() > 0.8 ? (Math.random() > 0.5 ? 2 : -2) : 0, // Slight random tilt
  }))
})
</script>

<template>
  <div class="word-cloud-container flex flex-wrap justify-center items-center gap-4 p-6 bg-neutral-900/30 rounded-lg border border-neutral-800">
    <template v-if="normalizedWords.length > 0">
        <span
        v-for="word in normalizedWords"
        :key="word.text"
        class="word transition-all duration-300 hover:scale-110 cursor-default select-none font-bold align-middle"
        :style="{
            fontSize: `${word.size}px`,
            color: word.color,
            transform: `rotate(${word.rotation}deg)`,
            opacity: 0.8,
            textShadow: `0 0 10px ${word.color}33`
        }"
        >
        {{ word.text }}
        </span>
    </template>
    <div v-else class="text-gray-500 text-sm">
        아직 분석된 태그가 없습니다.
    </div>
  </div>
</template>

<style scoped>
.word:hover {
    opacity: 1 !important;
    text-shadow: 0 0 15px currentColor !important;
    z-index: 10;
}
</style>
