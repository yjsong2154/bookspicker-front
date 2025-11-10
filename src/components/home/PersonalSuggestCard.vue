<!-- src/components/home/PersonalSuggestCard.vue -->
<script setup lang="ts">
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
  username?: string
}>()

const emit = defineEmits<{
  (e: 'open', id: string): void
}>()
</script>

<template>
  <section class="relative rounded-2xl overflow-hidden bg-neutral-900 ring-1 ring-neutral-800">
    <!-- 배경 이미지 -->
    <div class="relative h-52 md:h-72">
      <img
        :src="props.book.coverUrl"
        :alt="props.book.title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- 어둡게 오버레이 -->
      <div class="absolute inset-0 bg-neutral-950/60"></div>
    </div>

    <!-- 내용 -->
    <div class="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
      <h3 class="text-white text-xl md:text-2xl font-extrabold drop-shadow-sm">
        {{ username ?? '독자' }}님, 지금 이 책 어때요?
      </h3>
      <p class="text-neutral-200 text-sm md:text-base mt-2 max-w-2xl">
        사용자 취향을 반영한 예비 추천입니다. 지금 바로 미리보기로 첫 페이지를 열어보세요.
      </p>

      <div class="mt-4 flex items-center gap-3">
        <button
          class="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-100"
          @click="emit('open', props.book.id)"
        >
          ▶︎ 바로 보기
        </button>
        <button
          class="rounded-full bg-neutral-700 text-white px-4 py-2 text-sm hover:bg-neutral-600"
        >
          찜하기
        </button>
        <button
          class="rounded-full border border-neutral-400 text-neutral-200 px-4 py-2 text-sm hover:bg-white/5"
        >
          상세
        </button>
      </div>
    </div>
  </section>
</template>
