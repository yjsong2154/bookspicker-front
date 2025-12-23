<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Book } from '@/types/book'
import { bookApi } from '@/api/books'
import SearchBookCard from '@/components/book/SearchBookCard.vue'

const route = useRoute()
const query = ref('')
const searchResults = ref<Book[]>([])
const loading = ref(false)
const error = ref(false)

const searchBooks = async (q: string) => {
  if (!q) {
    searchResults.value = []
    return
  }

  loading.value = true
  error.value = false
  try {
    const res = await bookApi.searchBooks(q)
    searchResults.value = res.data.books || []
    console.log(res)
  } catch (e) {
    console.error('Search failed:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Watch for query changes in URL
watch(() => route.query.q, (newQ) => {
  if (typeof newQ === 'string') {
    query.value = newQ
    searchBooks(newQ)
  }
}, { immediate: true })

const handleWish = async (book: Book) => {
  try {
    const res = await bookApi.toggleWishlist(book.isbn)
    // Update local state to reflect change immediately if possible
    // Ideally endpoints return the new state, let's assume simple toggle for UI feedback or re-fetch
    book.isWished = res.data.is_wished
  } catch (e) {
    console.error('Failed to toggle wishlist:', e)
  }
}

const handleRead = (book: Book) => {
  // TODO: Navigation to reader or detail
  console.log('Read book:', book.title)
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 min-h-[calc(100vh-theme(spacing.14)-theme(spacing.20))]">
    <h1 class="text-2xl font-extrabold text-white mb-6">
      Search Results: <span class="text-yellow-400">"{{ query }}"</span>
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-neutral-400 py-20">
      <p>검색 중입니다...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 py-20">
      <p>검색 도중 오류가 발생했습니다.</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!searchResults.length && query" class="text-center text-neutral-400 py-20">
      <p>검색 결과가 없습니다.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <div v-for="book in searchResults" :key="book.id" class="group">
        <SearchBookCard
          :book="book"
          @wish="handleWish"
          @read="handleRead"
        />
      </div>
    </div>
  </main>
</template>
