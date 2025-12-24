<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'

const props = defineProps<{
  book: Book
  username?: string
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/books/${props.book.isbn}`)
}
</script>

<template>
  <section class="relative w-full overflow-hidden rounded-3xl bg-[#1e222e]">
    <!-- Background Spotlight Effect -->
    <div
      class="pointer-events-none absolute -top-[20%] right-1/2 h-[150%] w-[60%] translate-x-1/2 -rotate-12 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl"
    ></div>

    <div class="relative z-10 grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:p-12">
      <!-- Left: Text Content -->
      <div class="text-left">
        <h2 class="mb-4 text-3xl font-bold text-[#e2e8f0] md:text-4xl">
          나를 위한 추천
        </h2>
        <div class="mb-6 space-y-2">
          <p class="text-lg leading-relaxed text-[#94a3b8]">
            <span class="font-semibold text-indigo-300">{{ props.username ?? '독자' }}</span>님, 이 책은 어떠신가요?
          </p>
          <p class="text-base text-[#64748b] line-clamp-2">
            {{ props.book.summary || '취향 분석을 통해 선정된 도서입니다.' }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="group inline-flex items-center gap-2 rounded-lg bg-[#334155] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#475569]"
            @click="goToDetail"
          >
            바로 보기
          </button>
        </div>
      </div>

      <!-- Right: Book Image with 3D effect -->
      <div class="relative flex justify-center py-4 md:py-0">
        <!-- Decoration Label -->
        <div
          class="absolute -bottom-4 left-10 z-20 rotate-[5deg] bg-indigo-600 px-4 py-1 text-sm font-bold text-white shadow-lg md:left-16 md:text-base"
        >
          취향 저격
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
