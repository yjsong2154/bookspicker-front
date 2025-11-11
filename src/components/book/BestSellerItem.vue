<!-- src/components/best/BestSellerItem.vue -->
<script setup lang="ts">
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
  rank: number
}>()

const emit = defineEmits<{
  (e: 'open', id: string): void
  (e: 'wish', id: string): void
}>()
</script>

<template>
  <li class="flex items-start gap-4 py-6 border-b border-neutral-800">
    <!-- 순위 -->
    <div class="w-10 shrink-0 text-3xl font-extrabold text-amber-400 leading-none">{{ rank }}</div>

    <!-- 표지 -->
    <img
      :src="book.coverUrl"
      :alt="book.title"
      class="h-28 w-20 rounded-md object-cover ring-1 ring-neutral-700 shrink-0"
    />

    <!-- 정보 -->
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-bold text-white truncate">{{ book.title }}</h3>
        <span class="text-sm text-neutral-400">· {{ book.author }}</span>
      </div>

      <!-- 장르 뱃지 -->
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="(g, i) in (book.genres || [])"
          :key="i"
          class="px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700"
        >
          {{ g }}
        </span>
      </div>

      <!-- 요약 -->
      <p class="mt-3 text-sm text-neutral-300 clamp-2">
        {{ book.summary || '요약 정보가 준비 중입니다.' }}
      </p>

      <!-- 액션 -->
      <div class="mt-4 flex items-center gap-3">
        <button
          class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
          @click="emit('open', book.id)"
        >
          바로 보기
        </button>
        <a
          :href="book.buyUrl || '#'"
          target="_blank"
          class="rounded-md bg-neutral-700 px-3 py-1.5 text-sm text-white hover:bg-neutral-600"
        >
          구매 링크
        </a>
        <button
          class="rounded-md ring-1 ring-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
          @click="emit('wish', book.id)"
        >
          찜하기
        </button>
      </div>
    </div>

    <!-- 우측 아이콘(자리표시자) -->
    <div class="hidden sm:flex flex-col items-center gap-3 pl-2">
      <span class="h-8 w-8 grid place-items-center rounded-full bg-neutral-800 text-neutral-300">★</span>
      <span class="h-8 w-8 grid place-items-center rounded-full bg-neutral-800 text-neutral-300">ℹ︎</span>
    </div>
  </li>
</template>

<style scoped>
/* line-clamp 대체(플러그인 없이) */
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
