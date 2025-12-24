<script setup lang="ts">
import type { Book } from '@/types/book'
import { ref, onMounted } from 'vue'
import { accountApi } from '@/api/accounts'
import { bookApi } from '@/api/books'
import { useWishlistStore } from '@/stores/wishlist'
import WishlistBookCard from '@/components/book/WishlistBookCard.vue'

const wishlist = useWishlistStore()
const wishBooks = ref<Book[]>([])

onMounted(async () => {
  try {
    const res = await accountApi.getBookList('wishlist')
    wishBooks.value = res.data.books
    console.log(wishBooks.value)
  } catch (e) {
    console.error(e)
  }
})

const handleRemove = async (book: Book) => {
  try {
    // API 호출로 찜 해제 (toggleWishlist는 이미 찜 상태면 해제함)
    await bookApi.toggleWishlist(book.isbn)

    // 로컬 상태 업데이트
    wishlist.remove(book.isbn)
    wishBooks.value = wishBooks.value.filter(b => b.isbn !== book.isbn) // book.id 대신 book.isbn 사용 권장 (일관성)
  } catch (error) {
    console.error('Failed to remove from wishlist:', error)
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10">
    <h1 class="text-center text-2xl font-extrabold text-white mb-10">Wishlist</h1>

    <!-- 비어있을 때 -->
    <div v-if="!wishBooks.length" class="text-center text-neutral-400 py-24">
      아직 찜한 도서가 없어요. 도서 카드의 <span class="text-white font-semibold">찜하기</span> 버튼을 눌러 보세요.
    </div>

    <!-- 그리드 -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <div v-for="book in wishBooks" :key="book.id" class="group">
        <WishlistBookCard
          :book="book"
          @remove="handleRemove"
        />
      </div>
    </div>
  </main>
</template>
