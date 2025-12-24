<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
  username?: string
  actionLabel?: string
}>()

const router = useRouter()

const handleAction = () => {
  // 사용자가 요청한 대로 상세 페이지로 이동
  router.push(`/books/${props.book.isbn}`)
}
</script>

<template>
  <section class="relative w-full overflow-hidden rounded-3xl bg-[#1e222e]">
    <!-- Background Spotlight Effect -->
    <!-- Top light source simulation -->
    <div
      class="pointer-events-none absolute -top-[20%] left-1/2 h-[150%] w-[60%] -translate-x-1/2 rotate-12 bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-3xl"
    ></div>

    <div class="relative z-10 grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:p-12">
      <!-- Left: Text Content -->
      <div class="text-left">
        <span class="mb-2 block text-sm font-bold text-pink-500">주목할 만한 책</span>
        <h2 class="mb-4 text-3xl font-bold text-[#e2e8f0] md:text-4xl">
          {{ props.book.title }}
        </h2>
        <div class="mb-6 space-y-2">
          <p class="text-lg leading-relaxed text-[#94a3b8] line-clamp-3">
            {{ props.book.summary || '작품 설명이 없습니다. 직접 읽어보며 이 책의 매력을 찾아보세요.' }}
          </p>
          <p class="text-sm text-[#64748b]">- 책 소개</p>
        </div>

        <button
          class="group inline-flex items-center gap-2 rounded-lg bg-[#334155] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#475569]"
          @click="handleAction"
        >
          {{ props.actionLabel || '보러가기' }}
        </button>
      </div>

      <!-- Right: Book Image with 3D effect -->
      <div class="relative flex justify-center py-4 md:py-0">
        <!-- Decoration Label -->
        <div
          class="absolute -bottom-4 right-10 z-20 rotate-[-5deg] bg-pink-600 px-4 py-1 text-sm font-bold text-white shadow-lg md:right-16 md:text-base"
        >
          이달의 주목도서
        </div>

        <!-- Book Wrapper -->
        <div class="relative w-32 md:w-44">
          <!-- Book Cover -->
          <img
            :src="props.book.coverUrl"
            :alt="props.book.title"
            class="relative z-10 w-full rounded-md shadow-2xl transition-transform duration-500 hover:-translate-y-2"
          />

          <!-- Bottom Shadow -->
          <div
            class="absolute -bottom-6 left-1/2 h-4 w-[90%] -translate-x-1/2 bg-black/30 blur-lg"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>
