<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookStore } from '@/stores/book'
import { mainApi } from '@/api/main'
import type { Book } from '@/types/book'
import BookRail from '@/components/home/BookRail.vue'
import Modal from '@/components/ui/Modal.vue'
import BookDetail from '@/components/book/BookDetail.vue'
import TodayPickCard from '@/components/home/TodayPickCard.vue'
import PersonalSuggestCard from '@/components/home/PersonalSuggestCard.vue'
import CurrentReadingBanner from '@/components/home/CurrentReadingBanner.vue'

const store = useBookStore()

// 주목할 만한 책 (From API)
const bannerBook = ref<Book | null>(null)

// 나를 위한 추천 (Still from store for now as placeholder/fallback)
const secondBook = computed(() => store.list.length >= 2 ? store.list[1] : null)

const selectedId = ref<string | null>(null)
const openModal = (id: string) => (selectedId.value = id)
const closeModal = () => (selectedId.value = null)

// 읽고 있는 책 정보
const currentBook = ref<Book | null>(null)
const currentProgress = ref(0)

const fetchCurrentReading = async () => {
  try {
    const { data } = await mainApi.getCurrentReading()
    if (data.current_reading_book) {
      currentBook.value = data.current_reading_book.book
      currentProgress.value = data.current_reading_book.progress ?? 67
    }
  } catch (error) {
    console.error('Failed to fetch current reading:', error)
  }
}

const bannerButtonLabel = ref('')
const fetchBanner = async () => {
  console.log('Fetching banner...')
  try {
    const { data } = await mainApi.getBanner()
    console.log(data)
    // API returns 'banners' array. User requested to use the first book.
    if (data.banners && data.banners.length > 0) {
      const banner = data.banners[0]!
      // console.log('Banner',banner)
      // Map Banner response to Book type
      bannerBook.value = {
        id: String(banner.banner_id),
        title: banner.title,
        author: '', // API response doesn't have author, using empty string
        coverUrl: banner.key_visual_image,
        summary: banner.description,
        buyUrl: banner.button?.url
      }
      bannerButtonLabel.value = banner.button?.label || '지금 확인하기'
      // console.log('Banner Book Set:', bannerBook.value)
    }
  } catch (error) {
    console.error('Failed to fetch banner:', error)
  }
}

onMounted(() => {
  fetchCurrentReading()
  fetchBanner()
})
</script>

<template>
  <main class="mx-auto max-w-6xl space-y-8 px-4">
    <!-- 현재 읽고 있는 책 -->
    <CurrentReadingBanner
      :book="currentBook"
      :progress="currentProgress"
    />

    <!-- 주목할 만한 책 (API Data) -->
    <TodayPickCard
      v-if="bannerBook"
      :book="bannerBook"
      :action-label="bannerButtonLabel"
      @open="openModal"
    />
    <PersonalSuggestCard
      v-if="secondBook"
      :book="secondBook!"
      username="누워엄"
      @open="openModal"
    />

    <BookRail title="요즘 뜨는" />
    <BookRail title="장르별 추천" />
    <BookRail title="에디터 픽" />
  </main>

  <Modal v-if="selectedId" @close="closeModal">
    <BookDetail :id="selectedId!" />
  </Modal>
</template>
