<!-- src/views/BestSellerView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bookApi } from '@/api/books'
import type { Book } from '@/types/book'
import BestSellerItem from '@/components/book/BestSellerItem.vue'

const router = useRouter()
const books = ref<Book[]>([])

onMounted(async () => {
  try {
    const { data } = await bookApi.getPopularBooks('monthly')
    console.log(data)
    books.value = data.items.map(item => ({
      id: item.isbn,
      isbn: item.isbn,
      title: item.title,
      author: item.author || item.publisher, // Fallback to publisher if author is missing
      coverUrl: item.cover_image,
      summary: item.abstract_descript,
      genres: item.top_tags,
      likeCount: item.like_count,
      isWished: item.is_wished
    }))
    console.log(books.value)
  } catch (error) {
    console.error('Failed to fetch best sellers:', error)
  }
})


const goToDetail = (id: string) => {
  router.push({ name: 'book-detail', params: { isbn: id } })
}

async function onWish(id: string) {
  try {
    const { data } = await bookApi.toggleWishlist(id)
    // Update local state
    const book = books.value.find(b => b.id === id)
    if (book) {
      book.isWished = data.is_wished
    }
  } catch (error) {
    console.error('Failed to toggle wishlist:', error)
  }
}
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8">
    <!-- 상단 바/뒤로가기(선택) -->
    <div class="mb-6 flex items-center justify-between">
      <button
        class="inline-flex items-center gap-2 rounded-md px-3 py-2 ring-1 ring-neutral-700 text-neutral-200 hover:bg-neutral-800"
        @click="router.back()"
      >
        ← 뒤로가기
      </button>
      <h1 class="text-2xl font-extrabold text-white">Best Seller</h1>
      <div class="w-[88px]"></div>
    </div>

    <!-- 리스트 -->
    <ul class="rounded-xl bg-neutral-900 ring-1 ring-neutral-800 px-4 sm:px-6">
      <BestSellerItem
        v-for="(book, idx) in books"
        :key="book.id"
        :book="book"
        :rank="idx + 1"
        @open="goToDetail"
        @wish="onWish"
      />
    </ul>
  </main>
</template>
