<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useBookStore } from '@/stores/book'
import BookRail from '@/components/home/BookRail.vue'
import Modal from '@/components/ui/Modal.vue'
import BookDetail from '@/components/book/BookDetail.vue'
import TodayPickCard from '@/components/home/TodayPickCard.vue'
import PersonalSuggestCard from '@/components/home/PersonalSuggestCard.vue'

const store = useBookStore()

// 예시로 첫 2개를 추천 카드에 사용 (원하면 서버/알고리즘 결과로 교체)
const todayBook = () => store.list[0]
const personalBook = () => store.list[1]

const selectedId = ref<string | null>(null)
const openModal = (id: string) => (selectedId.value = id)
const closeModal = () => (selectedId.value = null)
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 space-y-8">
    <!-- 상단 추천 카드 2종 -->
    <TodayPickCard v-if="store.list.length" :book="todayBook()" @open="openModal" />
    <PersonalSuggestCard v-if="store.list.length > 1" :book="personalBook()" username="누워엄" @open="openModal" />

    <!-- 기존 레일들 -->
    <BookRail title="요즘 뜨는" />
    <BookRail title="장르별 추천" />
    <BookRail title="에디터 픽" />
  </main>

  <!-- 모달 -->
  <Modal v-if="selectedId" @close="closeModal">
    <BookDetail :id="selectedId!" />
  </Modal>
</template>
