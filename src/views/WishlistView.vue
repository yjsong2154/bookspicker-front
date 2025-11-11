<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBookStore } from '@/stores/book'
import { useWishlistStore } from '@/stores/wishlist'
import BookCard from '@/components/book/BookCard.vue'

const bookStore = useBookStore()
const wishlist = useWishlistStore()

onMounted(() => {
  if (!bookStore.list.length) bookStore.loadList()
  wishlist.load()
})

// 위시리스트에 담긴 id만 매핑
const wishBooks = computed(() =>
  wishlist.ids
    .map(id => bookStore.list.find(b => b.id === id))
    .filter(Boolean)
)
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10">
    <h1 class="text-center text-2xl font-extrabold text-white mb-10">Wishlist</h1>

    <!-- 비어있을 때 -->
    <div v-if="!wishBooks.length" class="text-center text-neutral-400 py-24">
      아직 찜한 도서가 없어요. 도서 카드의 <span class="text-white font-semibold">찜하기</span> 버튼을 눌러 보세요.
    </div>

    <!-- 그리드 -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="book in wishBooks" :key="book!.id" class="group">
        <BookCard :book="book!" />
        <!-- 카드 하단 아이콘/액션 (페이지 전용) -->
        <div class="mt-3 flex items-center gap-3 text-sm">
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-black font-bold">북</span>
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-neutral-300">ℹ︎</span>
          <button
            class="ml-auto rounded-md px-3 py-1.5 ring-1 ring-neutral-700 text-neutral-200 hover:bg-neutral-800"
            @click="$router.push({ name: 'home' })"
            title="미리보기"
          >
            미리보기
          </button>
          <button
            class="rounded-md px-3 py-1.5 bg-neutral-700 text-white hover:bg-neutral-600"
            @click="useWishlistStore().remove(book!.id)"
            title="찜 해제"
          >
            해제
          </button>
        </div>
        <hr class="mt-3 border-neutral-800" />
      </div>
    </div>
  </main>
</template>
