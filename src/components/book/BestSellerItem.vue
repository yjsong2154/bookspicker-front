<!-- src/components/best/BestSellerItem.vue -->
<script setup lang="ts">
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
  rank: number
}>()

console.log('Items:', props.book)



const emit = defineEmits<{
  (e: 'open', id: string): void
  (e: 'wish', id: string): void
}>()
</script>

<template>
  <li class="flex items-start gap-6 py-8 border-b border-neutral-800 last:border-0">
    <!-- 1. Rank -->
    <div class="w-12 shrink-0 text-center">
      <span class="text-4xl font-extrabold text-amber-400 italic">{{ rank }}</span>
    </div>

    <!-- 2. Cover & Thumbs Up -->
    <div class="relative shrink-0 group">
      <img
        :src="book.coverUrl"
        :alt="book.title"
        class="w-32 h-44 rounded-md object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
      />
      <!-- Thumbs Up Badge -->
      <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md ring-1 ring-neutral-700 whitespace-nowrap">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
        <span>{{ book.likeCount || 0 }}</span>
      </div>
    </div>

    <!-- 3. Info -->
    <div class="flex-1 min-w-0 flex flex-col gap-3">
      <!-- Title & Author -->
      <div>
        <div class="flex items-baseline gap-3 mb-1">
          <h3 class="text-xl font-bold text-white truncate">{{ book.title }}</h3>
          <span class="text-sm text-neutral-400 truncate">{{ book.author }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(g, i) in (book.genres || [])"
          :key="i"
          class="px-3 py-1 text-xs font-medium rounded-full bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700"
        >
          # {{ g }}
        </span>
        <!-- Fallback tags if no genres -->
        <template v-if="!book.genres?.length">
          <span class="px-3 py-1 text-xs font-medium rounded-full bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700"># 테그 없음</span>
        </template>
      </div>

      <!-- Summary -->
      <p class="text-sm text-neutral-300 leading-relaxed line-clamp-3">
        {{ book.summary || '문명사회에서 벗어나 자연 속 오두막에서 자급자족하며 단순한 삶을 실천한 경험을 담았어요. 그는 이를 통해 진정한 자유와 행복은 외부의 풍요가 아니라 스스로를 성찰하고 자연과 조화를 이루는 삶에서 비롯된다는 메시지를 전합니다.' }}
      </p>
    </div>

    <!-- 4. Actions -->
    <div class="shrink-0 flex flex-col gap-3 pt-2">
      <button
        class="group flex items-center gap-1 text-sm font-bold text-white hover:text-neutral-300 transition-colors"
        @click="emit('open', book.id)"
      >
        <span>바로 읽기</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button
        class="text-left text-sm font-bold transition-colors"
        :class="book.isWished ? 'text-rose-500 hover:text-rose-400' : 'text-neutral-400 hover:text-white'"
        @click="emit('wish', book.id)"
      >
        {{ book.isWished ? '♥ 찜 취소' : '♡ 찜하기' }}
      </button>
    </div>
  </li>
</template>

