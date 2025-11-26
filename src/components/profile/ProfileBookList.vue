<script setup lang="ts">
defineProps<{
  title: string
  books: {
    title: string
    author: string
    publisher: string
  }[]
}>()
</script>

<template>
  <div class="flex flex-col h-full">
    <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
      {{ title }} <span class="text-neutral-500 text-sm font-normal">+</span>
    </h3>
    <ul class="flex flex-col gap-4">
      <li v-for="(book, i) in books" :key="i" class="flex items-center justify-between text-sm">
        <span class="font-bold text-neutral-200 truncate pr-4">{{ book.title }}</span>
        <span class="text-neutral-500 shrink-0 text-xs">{{ book.author }} | {{ book.publisher }}</span>
      </li>
    </ul>
  </div>
</template>
