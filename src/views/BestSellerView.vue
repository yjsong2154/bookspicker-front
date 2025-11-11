<!-- src/views/BestSellerView.vue -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useBookStore } from '@/stores/book'
import BestSellerItem from '@/components/book/BestSellerItem.vue'
import Modal from '@/components/ui/Modal.vue'
import BookDetail from '@/components/book/BookDetail.vue'

const store = useBookStore()

onMounted(() => {
  if (!store.list.length) store.loadList()
})

// 랭킹 10개 (여기서는 임시로 기존 mock을 그대로 Top10으로 사용)
const top10 = computed(() => store.list.slice(0, 10))

const selectedId = ref<string | null>(null)
const openModal = (id: string) => (selectedId.value = id)
const closeModal = () => (selectedId.value = null)

function onWish(id: string) {
  // TODO: 찜하기 로직 연결 (pinia/로컬스토리지 등)
  console.log('wish: ', id)
}
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8">
    <!-- 상단 바/뒤로가기(선택) -->
    <div class="mb-6 flex items-center justify-between">
      <button
        class="inline-flex items-center gap-2 rounded-md px-3 py-2 ring-1 ring-neutral-700 text-neutral-200 hover:bg-neutral-800"
        @click="$router.back()"
      >
        ← 뒤로가기
      </button>
      <h1 class="text-2xl font-extrabold text-white">Best Seller</h1>
      <div class="w-[88px]"></div>
    </div>

    <!-- 리스트 -->
    <ul class="rounded-xl bg-neutral-900 ring-1 ring-neutral-800 px-4 sm:px-6">
      <BestSellerItem
        v-for="(book, idx) in top10"
        :key="book.id"
        :book="book"
        :rank="idx + 1"
        @open="openModal"
        @wish="onWish"
      />
    </ul>
  </main>

  <!-- 모달(바로 보기) -->
  <Modal v-if="selectedId" @close="closeModal">
    <BookDetail :id="selectedId!" />
  </Modal>
</template>
