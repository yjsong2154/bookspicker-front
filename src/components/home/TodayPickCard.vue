<!-- src/components/home/TodayPickCard.vue -->
<script setup lang="ts">
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
  username?: string
}>()

// 부모에서 모달을 열도록 id를 올려보냄
const emit = defineEmits<{
  (e: 'open', id: string): void
}>()
</script>

<template>
  <section
    class="relative rounded-2xl overflow-hidden ring-1 ring-neutral-800 bg-neutral-900"
  >
    <div class="grid grid-cols-1 md:grid-cols-2">
      <!-- 왼쪽: 그라데이션 + 카피 -->
      <div
        class="p-6 md:p-8 bg-gradient-to-r from-fuchsia-700/70 via-rose-600/70 to-amber-500/70 text-white"
      >
        <p class="text-xs/none opacity-90 mb-2">추천받은 결과</p>
        <h2 class="text-2xl md:text-3xl font-extrabold drop-shadow-sm">
          오늘의 추천, <span class="text-amber-200">한 장만</span> 읽어볼까요?
        </h2>
        <p class="text-sm md:text-base opacity-90 mt-3">
          취향 기반으로 고른 도서입니다. ‘찜하기’로 저장하고, ‘바로 보기’로 미리보기를 시작해 보세요.
        </p>

        <div class="mt-5 flex items-center gap-3">
          <button
            class="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-100"
            @click="emit('open', props.book.id)"
          >
            ▶︎ 바로 보기
          </button>
          <button
            class="rounded-full border border-white/70 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            건너뛰기
          </button>
        </div>
      </div>

      <!-- 오른쪽: 표지 이미지 -->
      <div class="relative h-48 md:h-full">
        <img
          :src="props.book.coverUrl"
          :alt="props.book.title"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
</template>
