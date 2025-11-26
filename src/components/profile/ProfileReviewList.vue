<script setup lang="ts">
defineProps<{
  reviews: {
    title: string
    author: string
    publisher: string
    date: string
    content: string
  }[]
}>()
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
      내가 쓴 리뷰 <span class="text-neutral-500 text-sm font-normal">+</span>
    </h3>
    <ul class="flex flex-col gap-8">
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
