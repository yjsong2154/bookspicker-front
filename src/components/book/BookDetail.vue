<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBookStore } from '@/stores/book'
import type { Book } from '@/types/book'

const props = defineProps<{ id: string }>()
const store = useBookStore()
const book = ref<Book | null>(null)

onMounted(async () => {
  book.value = await store.loadById(props.id)
})
</script>

<template>
  <div v-if="book" class="flex gap-6">
    <img :src="book.coverUrl" :alt="book.title" class="w-36 h-52 object-cover rounded-lg" />
    <div>
      <h2 class="text-xl font-bold">{{ book.title }}</h2>
      <p class="text-sm text-neutral-500 mb-2">{{ book.author }}</p>
      <p class="text-sm leading-6 mb-4">{{ book.summary }}</p>
      <div class="flex gap-3">
        <a v-if="book.canReadInline" class="px-3 py-2 rounded bg-black text-white text-sm" href="#">
          바로 읽기
        </a>
        <a v-if="book.buyUrl" class="px-3 py-2 rounded border text-sm" :href="book.buyUrl" target="_blank">
          구매하러 가기
        </a>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>
