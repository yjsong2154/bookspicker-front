```vue
<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { useBookStore } from '@/stores/book'
import BookCard from '@/components/book/BookCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

defineProps<{ title: string }>()
const store = useBookStore()

const railRef = ref<HTMLDivElement | null>(null)

// 책 목록이 비어있으면 불러오기
onMounted(() => {
  if (!store.list.length) store.loadList()
  else initScroll()
})

// 무한 스크롤을 위해 리스트를 5배로 늘림 (충분한 스크롤 영역 확보)
const displayList = computed(() => {
  if (!store.list.length) return []
  return [...store.list, ...store.list, ...store.list, ...store.list, ...store.list]
})

// 초기 스크롤 위치를 중앙으로 설정
const initScroll = async () => {
  await nextTick()
  if (railRef.value && displayList.value.length) {
    const el = railRef.value
    const singleSetWidth = el.scrollWidth / 5
    // 3번째 세트(인덱스 2)의 시작점으로 이동
    el.scrollLeft = singleSetWidth * 2
  }
}

// 리스트가 로드되면 스크롤 위치 초기화
watch(() => store.list.length, (newLen) => {
  if (newLen) initScroll()
})

// 무한 스크롤 처리 함수
const handleScroll = () => {
  if (railRef.value) {
    const el = railRef.value
    const singleSetWidth = el.scrollWidth / 5

    // 오른쪽으로 스크롤하여 4번째 세트(인덱스 3)에 진입하면 3번째 세트(인덱스 2)로 되돌림
    if (el.scrollLeft >= singleSetWidth * 3) {
      el.scrollLeft -= singleSetWidth
    }
    // 왼쪽으로 스크롤하여 2번째 세트(인덱스 1)에 진입하면 3번째 세트(인덱스 2)로 되돌림
    else if (el.scrollLeft <= singleSetWidth) {
      el.scrollLeft += singleSetWidth
    }
  }
}

const scrollLeft = () => {
  if (railRef.value) {
    railRef.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (railRef.value) {
    railRef.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">{{ title }}</h2>

    <div class="relative group">
      <!-- 왼쪽 화살표 (PC에서만 보임) -->
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <div
        ref="railRef"
        class="railContainer"
        @scroll="handleScroll"
      >
        <template v-if="!store.loading && displayList.length">
          <div
            class="bookWrapper"
            v-for="(book, index) in displayList"
            :key="`${book.id}-${index}`"
          >
            <BookCard :book="book" />
          </div>
        </template>

        <template v-else>
          <Skeleton v-for="i in 6" :key="i" class="bookWrapper" />
        </template>
      </div>

      <!-- 오른쪽 화살표 (PC에서만 보임) -->
      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
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

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* Webkit (Chrome, Safari, etc.) 스크롤바 숨기기 */
.railContainer::-webkit-scrollbar {
  display: none;
}

.bookWrapper {
  scroll-snap-align: start;
  width: 240px; /* 책 카드의 너비 240px */
  height: 480px; /* 책 카드 높이 설정 (400 -> 480으로 증가) */
  flex-shrink: 0; /* 가로 스크롤 시 축소되지 않도록 설정 */
}
</style>
