<script setup lang="ts">
defineProps<{
  reviews: {
    title: string
    author: string
    publisher: string
    date: string
    content: string
  }[]
  loading?: boolean
  error?: boolean
}>()
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
      내가 쓴 리뷰 <span class="text-neutral-500 text-sm font-normal">+</span>
    </h3>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 flex justify-center">
      <div class="animate-pulse text-neutral-500 text-sm">리뷰를 불러오는 중입니다...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12 flex flex-col items-center gap-4">
      <p class="text-sm text-red-900/70 italic">api 연동중 문제가 생겼습니다.</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="reviews.length === 0" class="py-12 flex flex-col items-center gap-4">
      <p class="text-sm text-neutral-600 italic">리뷰가 없습니다.</p>
    </div>

    <!-- Review List -->
    <ul v-else class="flex flex-col gap-8">
      <li v-for="(review, i) in reviews" :key="i" class="flex flex-col gap-2 border-b border-neutral-800 pb-8 last:border-0 last:pb-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-neutral-200">{{ review.title }}</span>
            <span class="text-xs text-neutral-500">{{ review.author }} | {{ review.publisher }}</span>
          </div>
          <span class="text-xs text-neutral-500">{{ review.date }}</span>
        </div>
        <p class="text-sm text-neutral-400 leading-relaxed line-clamp-2">
          {{ review.content }}
        </p>
      </li>
    </ul>
  </div>
</template>
