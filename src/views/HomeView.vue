<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookStore } from '@/stores/book'
import BookRail from '@/components/home/BookRail.vue'
import Modal from '@/components/ui/Modal.vue'
import BookDetail from '@/components/book/BookDetail.vue'
import TodayPickCard from '@/components/home/TodayPickCard.vue'
import PersonalSuggestCard from '@/components/home/PersonalSuggestCard.vue'

const store = useBookStore()

// 존재 보장용 computed
const firstBook  = computed(() => store.list.length >= 1 ? store.list[0] : null)
const secondBook = computed(() => store.list.length >= 2 ? store.list[1] : null)

const selectedId = ref<string | null>(null)
const openModal = (id: string) => (selectedId.value = id)
const closeModal = () => (selectedId.value = null)
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 space-y-8">
    <!-- v-if로 존재 보장 후 non-null 단언으로 전달 -->
    <TodayPickCard
      v-if="firstBook"
      :book="firstBook!"
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
