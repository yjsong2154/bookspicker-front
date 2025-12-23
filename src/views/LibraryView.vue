<script setup lang="ts">
import type { Book } from '@/types/book'
import { ref, onMounted } from 'vue'
import { accountApi } from '@/api/accounts'
import { bookApi } from '@/api/books'
import LibraryBookCard from '@/components/book/LibraryBookCard.vue'

const libraryBooks = ref<Book[]>([])

onMounted(async () => {
  try {
    const res = await accountApi.getBookList('library')
    libraryBooks.value = res.data.books
  } catch (e) {
    console.error(e)
  }
})

const handleRemove = async (book: Book) => {
  try {
    // Assuming addToLibrary toggles the status. If it was in library, it should be removed.
    await bookApi.addToLibrary(book.isbn)
    libraryBooks.value = libraryBooks.value.filter(b => b.id !== book.id)
  } catch (e) {
    console.error('Failed to remove book from library', e)
  }
}

const handleRead = (book: Book) => {
  console.log('Read book:', book.title)
  // TODO: Implement read functionality navigation
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
          @read="handleRead"
        />
      </div>
    </div>
  </main>
</template>
