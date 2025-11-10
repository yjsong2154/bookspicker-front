<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBookStore } from '@/stores/book'
import BookCard from '@/components/book/BookCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

const props = defineProps<{ title: string }>()
const store = useBookStore()

const railRef = ref<HTMLDivElement | null>(null)

// 책 목록이 비어있으면 불러오기
onMounted(() => {
  if (!store.list.length) store.loadList()
})

// 무한 스크롤 처리 함수
const handleScroll = () => {
  if (railRef.value) {
    const el = railRef.value
    const isEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 5
    if (isEnd) {
      el.scrollLeft = 0 // 끝에 도달하면 처음으로 돌아가게
    }
  }
}
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <div
      ref="railRef"
      class="railContainer"
      @scroll="handleScroll"
    >
      <template v-if="!store.loading && store.list.length">
        <div
          class="bookWrapper"
          v-for="book in store.list"
          :key="book.id"
        >
          <BookCard :book="book" />
        </div>
      </template>

      <template v-else>
        <Skeleton v-for="i in 6" :key="i" class="bookWrapper" />
      </template>
    </div>
  </section>
</template>

<style scoped>
.railContainer {
  display: flex;
  gap: 10px;
  overflow-x: auto; /* 가로 스크롤 가능 */
  scroll-snap-type: x mandatory; /* 스크롤 할 때 카드가 스냅 되도록 */
  scroll-padding-left: 20px;
  white-space: nowrap;
  width: 100%;
}

.bookWrapper {
  scroll-snap-align: start;
  width: 240px; /* 책 카드의 너비 240px */
  height: 400px; /* 책 카드 높이 설정 */
  flex-shrink: 0; /* 가로 스크롤 시 축소되지 않도록 설정 */
}

.railContainer::-webkit-scrollbar {
  height: 8px;
}

.railContainer::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.railContainer::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
