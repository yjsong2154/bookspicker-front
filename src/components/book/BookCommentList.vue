<script setup lang="ts">
defineProps<{
  comments: {
    id: number
    user: string
    date: string
    content: string
  }[]
}>()
</script>

<template>
  <div class="mt-8">
    <ul class="space-y-6">
      <li v-for="comment in comments" :key="comment.id" class="flex gap-4">
        <!-- Avatar Placeholder -->
        <div class="w-10 h-10 rounded-full bg-white shrink-0"></div>

        <div class="flex-1">
          <div class="flex items-baseline gap-2 mb-1">
            <span class="font-bold text-white">{{ comment.user }}</span>
            <span class="text-xs text-neutral-500">{{ comment.date }}</span>
          </div>
          <p class="text-sm text-neutral-300 leading-relaxed">
            {{ comment.content }}
          </p>
        </div>
      </li>
    </ul>

    <div class="mt-8 text-center">
      <button class="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
        더 보기
      </button>
    </div>
  </div>
</template>
