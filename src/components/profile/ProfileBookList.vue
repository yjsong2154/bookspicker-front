<script setup lang="ts">
defineProps<{
  title: string
  books: {
    title: string
    author: string
    publisher: string
  }[]
  loading?: boolean
  error?: boolean
}>()
</script>

<template>
  <div class="flex flex-col h-full">
    <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
      {{ title }} <span class="text-neutral-500 text-sm font-normal">+</span>
    </h3>

    <div v-if="loading" class="flex items-center justify-center py-10 text-neutral-500 text-sm">
      로딩 중...
    </div>

    <div v-else-if="error" class="flex items-center justify-center py-10 text-red-500 text-sm">
      API 오류
    </div>

    <div v-else-if="books.length === 0" class="flex items-center justify-center py-10 text-neutral-600 text-sm">
      없음
    </div>

    <ul v-else class="flex flex-col gap-4">
      <li v-for="(book, i) in books" :key="i" class="flex items-center justify-between text-sm">
        <span class="font-bold text-neutral-200 truncate pr-4">{{ book.title }}</span>
        <span class="text-neutral-500 shrink-0 text-xs">{{ book.publisher }}</span>
      </li>
    </ul>
  </div>
</template>
