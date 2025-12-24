<script setup lang="ts">
import type { Book } from '@/types/book'
import { ref, onMounted } from 'vue'
import { accountApi } from '@/api/accounts'
import { bookApi } from '@/api/books'
import { analysisApi } from '@/api/analysis'
import { useAuthStore } from '@/stores/auth'
import LibraryBookCard from '@/components/book/LibraryBookCard.vue'

const libraryBooks = ref<Book[]>([])
const authStore = useAuthStore()

onMounted(async () => {
  try {
    const res = await accountApi.getBookList('library')
    const BACKEND_BASE_URL = 'http://127.0.0.1:8000'
    libraryBooks.value = res.data.books.map((b: Book) => ({
      ...b,
      coverUrl: b.coverUrl && b.coverUrl.startsWith('http') ? b.coverUrl : `${BACKEND_BASE_URL}${b.coverUrl}`
    }))
  } catch (e) {
    console.error(e)
  }
})

const handleRemove = async (book: Book) => {
  try {
    // Delete from library via API
    await bookApi.deleteFromLibrary(book.isbn)

    // Sync with Analysis Server (Remove read history)
    if (authStore.user) {
        try {
            await analysisApi.removeReadHistory(parseInt(authStore.user.id), book.isbn)
        } catch (err) {
            console.error('Analysis Sync Error:', err)
        }
    }

    // Update local state
    libraryBooks.value = libraryBooks.value.filter(b => b.isbn !== book.isbn)
  } catch (e) {
    console.error('Failed to remove book from library', e)
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10">
    <h1 class="text-center text-2xl font-extrabold text-white mb-10">Library</h1>

    <!-- 비어있을 때 -->
    <div v-if="!libraryBooks.length" class="text-center text-neutral-400 py-24">
      아직 서재에 담은 도서가 없어요.
    </div>

    <!-- 그리드 -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <div v-for="book in libraryBooks" :key="book.id" class="group">
        <LibraryBookCard
          :book="book"
          @remove="handleRemove"
        />
      </div>
    </div>
  </main>
</template>
