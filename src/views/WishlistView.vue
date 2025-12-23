<script setup lang="ts">
import type { Book } from '@/types/book'
import { ref, onMounted } from 'vue'
import { accountApi } from '@/api/accounts'
import { useWishlistStore } from '@/stores/wishlist'
import WishlistBookCard from '@/components/book/WishlistBookCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const handleRemove = (book: Book) => {
  wishlist.remove(book.id)
  wishBooks.value = wishBooks.value.filter(b => b.id !== book.id)
}

const handlePreview = () => {
  router.push({ name: 'home' })
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
          @preview="handlePreview"
        />
      </div>
    </div>
  </main>
</template>
