<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { useBookStore } from '@/stores/book'
import { useAuthStore } from '@/stores/auth'
import { mainApi } from '@/api/main'
import { analysisApi, type RecommendationSection } from '@/api/analysis'
import type { Book } from '@/types/book'
import BookRail from '@/components/home/BookRail.vue'
import Modal from '@/components/ui/Modal.vue'
import BookDetail from '@/components/book/BookDetail.vue'
import TodayPickCard from '@/components/home/TodayPickCard.vue'
import PersonalSuggestCard from '@/components/home/PersonalSuggestCard.vue'
import CurrentReadingBanner from '@/components/home/CurrentReadingBanner.vue'

// const store = useBookStore() // Unused
const authStore = useAuthStore()

// 주목할 만한 책 (From API)
const bannerBook = ref<Book | null>(null)

// 나를 위한 추천 (AI Best Pick)
const aiBestPick = ref<Book | null>(null)

// 나머지 추천 섹션 (Rails)
const recommendationSections = ref<RecommendationSection[]>([])

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
  try {
    const { data } = await mainApi.getBanner()
    if (data.banners && data.banners.length > 0) {
      const banner = data.banners[0]!
      bannerBook.value = {
        id: String(banner.banner_id),
        isbn: '',
        title: banner.title,
        author: '',
        coverUrl: banner.key_visual_image,
        summary: banner.description,
        buyUrl: banner.button?.url
      }
      bannerButtonLabel.value = banner.button?.label || '지금 확인하기'
    }
  } catch (error) {
    console.error('Failed to fetch banner:', error)
  }
}

const fetchRecommendations = async () => {
  if (!authStore.user?.id) return

  // Need numeric ID for analysis server?
  // authStore.user.id is string (from previous view file).
  // Checking auth store again...
  // authStore.user: { id: string, email: string ... } but login logic sends id_backend: user.id.
  // Wait, in previous conversation "Syncing User IDs", id_backend was added.
  // Docs say /users/{id_backend}/advanced-recommendations.
  // Is authStore.user.id the backend ID?
  // Store definition: id: string.
  // Login response: user.id.
  // Let's assume authStore.user.id can be cast to number, or is the ID we need.
  // Actually, usually user.id is the primary key.
  // Let's try parsing it.

  try {
    const userId = Number(authStore.user.id)
    if (isNaN(userId)) {
      console.warn('User ID is not a number, skipping analysis fetch')
      return
    }

    console.log("userId : ",userId)
    const { data } = await analysisApi.getAdvancedRecommendations(userId)
    console.log("추천 : ",data)

    // 1. "ai가 가장 추천" section
    const bestPickSection = data.sections.find(s => s.title === 'ai가 가장 추천')
    if (bestPickSection && bestPickSection.books.length > 0) {
      const bookData = bestPickSection.books[0]!
      aiBestPick.value = {
        id: bookData.isbn, // Using ISBN as ID for now
        isbn: bookData.isbn,
        title: bookData.title,
        author: bookData.author,
        coverUrl: bookData.cover_image,
        summary: bookData.description
      }
    }

    // 2. Other sections for rails
    recommendationSections.value = data.sections.filter(s => s.title !== 'ai가 가장 추천')
    console.log("recommendationSections : ",recommendationSections.value)

  } catch (error) {
    console.error('Failed to fetch recommendations:', error)
  }
}

onMounted(() => {
  fetchCurrentReading()
  fetchBanner()
  fetchRecommendations()
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

    <!-- 나를 위한 추천 (AI Best Pick) -->
    <PersonalSuggestCard
      v-if="aiBestPick"
      :book="aiBestPick"
      :username="authStore.user?.name || '사용자'"
      @open="openModal"
    />

    <!-- Dynamic Recommendation Rails -->
    <BookRail
      v-for="(section, idx) in recommendationSections"
      :key="idx"
      :title="section.title"
      :books="section.books.map(b => ({
        id: b.isbn,
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        coverUrl: b.cover_image,
        summary: b.description
      }))"
    />
  </main>

  <Modal v-if="selectedId" @close="closeModal">
    <BookDetail :id="selectedId!" />
  </Modal>
</template>
