<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'

const props = defineProps<{ book: Book }>()
const emit = defineEmits<{
  (e: 'remove', book: Book): void
  // read emit removed in favor of direct navigation
}>()

const router = useRouter()
const goToDetail = () => {
  router.push(`/books/${props.book.isbn}`)
}
</script>

<template>
  <div class="relative w-full flex flex-col gap-3">
    <!-- Cover Image Container -->
    <div class="relative w-full aspect-[1/1.5] shadow-md">
      <img
        :src="props.book.coverUrl"
        :alt="props.book.title"
        class="w-full h-full object-cover cursor-pointer"
        loading="lazy"
        @click="goToDetail"
      />
    </div>

    <!-- Info Area -->
    <div class="flex flex-col items-center text-center px-1">
      <h3
        class="text-white font-bold text-xl leading-tight line-clamp-2 mb-1 w-full cursor-pointer hover:underline"
        @click="goToDetail"
      >
        {{ props.book.title }}
      </h3>
      <p class="text-neutral-400 text-sm mb-3 w-full truncate">
        {{ props.book.author }}
      </p>

      <!-- Buttons -->
      <div class="flex gap-2">
        <button
          @click="goToDetail"
          class="text-xs text-neutral-500 hover:text-white border border-neutral-700 hover:border-white px-3 py-1 rounded-full transition-all"
        >
          바로읽기
        </button>
        <button
          @click.stop="emit('remove', props.book)"
          class="text-xs text-neutral-500 hover:text-white border border-neutral-700 hover:border-white px-3 py-1 rounded-full transition-all"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>
