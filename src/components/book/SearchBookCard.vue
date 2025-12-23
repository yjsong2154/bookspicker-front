<script setup lang="ts">
import type { Book } from '@/types/book'
import { computed } from 'vue'

const props = defineProps<{ book: Book }>()

const emit = defineEmits<{
  (e: 'wish', book: Book): void
  (e: 'read', book: Book): void
}>()

// 찜 상태에 따라 버튼 텍스트나 스타일을 바꿀 수 있음.
// Book interface에 isWished가 optional로 있음.
const isWished = computed(() => props.book.isWished || false)
</script>

<template>
  <div class="relative w-full flex flex-col gap-3">
    <!-- Cover Image Container -->
    <div class="relative w-full aspect-[1/1.5] shadow-md group-hover:scale-[1.02] transition-transform duration-300">
      <img
        :src="props.book.coverUrl"
        :alt="props.book.title"
        class="w-full h-full object-cover rounded-sm"
        loading="lazy"
      />
      <!-- Hover Overlay (Optional enhancement based on description) -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
         <!-- Can put icon buttons here too if desired, but sticking to requested text buttons below for now -->
      </div>
    </div>

    <!-- Info Area -->
    <div class="flex flex-col items-center text-center px-1">
      <h3 class="text-white font-bold text-lg leading-tight line-clamp-2 mb-1 w-full">
        {{ props.book.title }}
      </h3>
      <p class="text-neutral-400 text-sm mb-3 w-full truncate">
        {{ props.book.author }}
      </p>

      <!-- Buttons -->
      <div class="flex gap-2">
        <button
          @click.stop="emit('read', props.book)"
          class="text-xs text-neutral-400 hover:text-white border border-neutral-700 hover:border-white hover:bg-neutral-800 px-3 py-1 rounded-full transition-all"
        >
          바로 읽기
        </button>
        <button
          @click.stop="emit('wish', props.book)"
          class="text-xs px-3 py-1 rounded-full transition-all border"
          :class="[
            isWished
              ? 'text-yellow-400 border-yellow-400 hover:bg-yellow-400/10'
              : 'text-neutral-400 border-neutral-700 hover:text-white hover:border-white hover:bg-neutral-800'
          ]"
        >
          {{ isWished ? '찜 완료' : '찜하기' }}
        </button>
      </div>
    </div>
  </div>
</template>
