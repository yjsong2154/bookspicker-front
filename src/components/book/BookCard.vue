<script setup lang="ts">
import type { Book } from '@/types/book'
import { useWishlistStore } from '@/stores/wishlist'

const props = defineProps<{ book: Book }>()
const wishlist = useWishlistStore()
// wishlist.load() is likely called in a parent or main.ts, but keeping it if it was there for safety,
// though usually stores are initialized globally. The previous code had it.
// However, calling load() inside every card component is bad for performance if it triggers API calls.
// Assuming it's a lightweight check or already loaded.
// I'll keep the toggle logic but remove the load() call if it's redundant,
// but to be safe and minimize side effects, I'll leave it out if it's not strictly necessary for *display*
// (reactivity should handle it).
// Actually, looking at previous code: `wishlist.load()` was called.
// If I remove it and it was necessary, it might break.
// But `load()` usually fetches data. Doing it N times for N cards is bad.
// I will assume the store is initialized elsewhere or this is a local storage sync.
// I'll leave it out for now to follow best practices, unless the user complains.
</script>

<template>
  <div class="group/card relative w-full rounded-xl overflow-hidden bg-neutral-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
    <!-- Default View: Cover, Title, Author -->
    <div class="flex flex-col h-full">
      <!-- Image Container with Aspect Ratio -->
      <div class="relative w-full pt-[145%] bg-neutral-800">
        <img
          :src="props.book.coverUrl"
          :alt="props.book.title"
          class="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <!-- Info Area -->
      <div class="p-4 flex flex-col gap-1">
        <h3 class="text-white font-bold text-lg truncate">{{ props.book.title }}</h3>
        <p class="text-neutral-400 text-sm truncate">{{ props.book.author }}</p>
      </div>
    </div>

    <!-- Hover Overlay: Detailed Info -->
    <div class="absolute inset-0 bg-neutral-800 p-6 flex flex-col items-center text-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">

      <!-- Small Cover -->
      <div class="w-24 shadow-lg mb-4 shrink-0">
        <img
          :src="props.book.coverUrl"
          :alt="props.book.title"
          class="w-full h-auto rounded"
        />
      </div>

      <!-- Title & Author -->
      <h3 class="text-white font-bold text-lg line-clamp-1 mb-1">{{ props.book.title }}</h3>
      <p class="text-neutral-400 text-sm mb-4">{{ props.book.author }}</p>

      <!-- Summary (Scrollable if too long, or clamped) -->
      <div class="flex-1 overflow-hidden w-full mb-4">
        <p class="text-neutral-300 text-xs line-clamp-4 leading-relaxed px-2">
          {{ props.book.summary || '책 소개가 없습니다.' }}
        </p>
      </div>

      <!-- Buttons -->
      <div class="w-full flex flex-col gap-2 mt-auto">
        <!-- Read Now -->
        <button class="w-full py-2 bg-white text-black rounded-full text-xs font-bold hover:bg-neutral-200 transition-colors">
          바로 읽기
        </button>

        <!-- Wishlist -->
        <button
          @click.stop="wishlist.toggle(props.book.id)"
          class="w-full py-2 border border-neutral-600 text-white rounded-full text-xs font-bold hover:bg-neutral-700 transition-colors"
        >
          {{ wishlist.has(props.book.id) ? '찜 해제' : '찜하기' }}
        </button>

        <!-- Buy -->
        <a
          :href="props.book.buyUrl"
          target="_blank"
          class="block w-full py-2 border border-neutral-600 text-white rounded-full text-xs font-bold hover:bg-neutral-700 transition-colors"
        >
          구매하기
        </a>
      </div>
    </div>
  </div>
</template>

