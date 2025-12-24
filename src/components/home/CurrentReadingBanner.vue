<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'

const props = defineProps<{
  book?: Book | null
  progress?: number
  lastReadAt?: string
}>()

const router = useRouter()
const hasBook = computed(() => !!props.book)

const goToDetail = () => {
  if (props.book?.isbn) {
    router.push(`/books/${props.book.isbn}`)
  }
}
</script>

<template>
  <section
    v-if="hasBook && props.book"
    @click="goToDetail"
    class="flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-[#FCD34D] p-4 shadow-sm md:p-5 cursor-pointer transition-transform hover:scale-[1.01]"
  >
    <!-- Book Cover -->
    <div class="h-16 w-12 flex-shrink-0 overflow-hidden rounded shadow-sm md:h-20 md:w-14">
      <img
        :src="props.book.coverUrl"
        :alt="props.book.title"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col justify-center gap-2">
      <h3 class="line-clamp-1 text-lg font-bold text-neutral-900 md:text-xl">
        {{ props.book.title }}
      </h3>

      <div class="flex items-center gap-3">
        <!-- Progress Bar -->
        <div class="relative h-3 flex-1 overflow-hidden rounded-full bg-black/10">
          <div
            class="absolute left-0 top-0 h-full rounded-full bg-neutral-800"
            :style="{ width: `${props.progress ?? 0}%` }"
          ></div>
        </div>
        <!-- Percentage Text -->
        <span class="text-sm font-bold text-neutral-800">
          {{ props.progress ?? 0 }}%
        </span>
      </div>
    </div>
  </section>

  <section
    v-else
    class="flex w-full items-center justify-center rounded-2xl bg-neutral-100 py-6 text-neutral-400"
  >
    <p class="text-sm font-medium">읽고 있는 책이 없습니다.</p>
  </section>
</template>
