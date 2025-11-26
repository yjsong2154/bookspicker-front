<script setup lang="ts">
import { useRoute } from 'vue-router'
import ToggleSection from '@/components/common/ToggleSection.vue'
import BookCommentList from '@/components/book/BookCommentList.vue'

const route = useRoute()
const bookId = route.params.id

// Mock Data
const book = {
  id: bookId,
  title: '이야기의 신',
  author: '한윤섭(지은이) · 이로우(그림)',
  publisher: '라임',
  date: '2025-01-20',
  coverUrl: 'https://image.aladin.co.kr/product/35534/34/cover500/k882934773_1.jpg', // Placeholder or use a real URL if available
  thumbsUp: 381,
  category: 'Fairytale',
  tags: ['자연주의', '자기성찰', '도시생활에지친사람', '자연주의', '자기성찰', '자연주의', '도시생활에지친사람'],
  whyPicked: `최근 닉네임1님이 고르신 책들을 보면, 사람 사이의 따뜻함과 조용한 연민이 스며 있는 이야기를 유독 사랑한다는 게 느껴졌어요.
그런 독서 취향을 생각하면 《이야기의 신》은 정말 잘 맞는 책이에요.
이 책은 단순히 이야기를 설명하는 것이 아니라, 한 문장이 어떻게 마음을 어루만지고 관계를 따뜻하게 만드는 지를 깊고 다정하게 들려주거든요.
그래서 닉네임1님이 최근 빠져들었던 그 감정의 결이 왜 그렇게 특별했는지 자연스럽게 이해하게 될 거예요. 이 책은 닉네임1님의 그 따뜻한 독서 세계를 더 넓고 깊게 확장시켜줄 거예요.`,
  intro: `이야기의 신이 들려주는 이야기의 본질과 힘에 대한 동화입니다.
우리가 왜 이야기를 읽고 쓰고 듣는지, 그 근원적인 질문에 대한 답을 찾아가는 여정을 담고 있습니다.`,
  authorIntro: `한윤섭
동화 작가이자 희곡 작가입니다. 《봉주르, 뚜르》로 문학동네어린이문학상 대상을 받으며 작품 활동을 시작했습니다. 지은 책으로 《해리 엇》, 《서찰을 전하는 아이》, 《짜장면 로켓 발사》 등이 있습니다.

이로우
그림 작가입니다. 쓰고 그린 책으로 《두더지 팡》이 있고, 그린 책으로 《소리 질러, 운동장》, 《기호 3번 안석뽕》 등이 있습니다.`
}

const comments = [
  { id: 1, user: '행인1', date: '2025-02-01', content: '책을 끝까지 읽고 나니 마음에 잔잔한 여운이 남네요. 읽는 동안 참 많은 생각이 스쳐 지나갔어요. 마지막 페이지를 덮고도 한참 여운이 남는 책이었습니다. 좋은 시간 보냈습니다.' },
  { id: 2, user: '행인1', date: '2025-02-01', content: '책을 끝까지 읽고 나니 마음에 잔잔한 여운이 남네요. 읽는 동안 참 많은 생각이 스쳐 지나갔어요. 마지막 페이지를 덮고도 한참 여운이 남는 책이었습니다. 좋은 시간 보냈습니다.' },
  { id: 3, user: '행인1', date: '2025-02-01', content: '책을 끝까지 읽고 나니 마음에 잔잔한 여운이 남네요. 읽는 동안 참 많은 생각이 스쳐 지나갔어요. 마지막 페이지를 덮고도 한참 여운이 남는 책이었습니다. 좋은 시간 보냈습니다.' },
  { id: 4, user: '행인1', date: '2025-02-01', content: '책을 끝까지 읽고 나니 마음에 잔잔한 여운이 남네요. 읽는 동안 참 많은 생각이 스쳐 지나갔어요. 마지막 페이지를 덮고도 한참 여운이 남는 책이었습니다. 좋은 시간 보냈습니다.' },
]
</script>

<template>
  <main class="min-h-screen bg-black text-white pb-20">
    <!-- Header Section with Blur Background Effect (Optional, keeping it simple black for now as per image) -->
    <div class="relative pt-10 pb-6 px-4 flex flex-col items-center text-center">

      <!-- Cover Image -->
      <div class="w-40 h-60 rounded-md overflow-hidden shadow-2xl mb-6 relative z-10">
        <img :src="book.coverUrl" :alt="book.title" class="w-full h-full object-cover" />
      </div>

      <!-- Action Icons -->
      <div class="flex items-center gap-4 mb-6">
        <router-link :to="{ name: 'reader' }" class="w-10 h-10 rounded-full border border-neutral-600 grid place-items-center hover:bg-neutral-800 transition-colors">
          <!-- Book Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </router-link>
        <button class="w-10 h-10 rounded-full border border-neutral-600 grid place-items-center hover:bg-neutral-800 transition-colors">
          <!-- Heart Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button class="w-10 h-10 rounded-full border border-neutral-600 grid place-items-center hover:bg-neutral-800 transition-colors">
          <!-- Cart Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>

      <!-- Info -->
      <div class="w-full max-w-2xl text-left border-b border-neutral-800 pb-6 mb-8">
        <div class="text-sm text-neutral-500 mb-1">{{ book.category }}</div>
        <h1 class="text-3xl font-bold mb-2 flex items-center gap-2">
          {{ book.title }}
          <span class="text-sm font-normal text-neutral-500 flex items-center gap-1">
             👍 {{ book.thumbsUp }}
          </span>
        </h1>
        <div class="flex items-center justify-between text-sm text-neutral-400">
          <span>{{ book.author }}</span>
          <span>{{ book.date }}</span>
        </div>
      </div>

      <!-- Why Picked -->
      <div class="w-full max-w-2xl mb-8">
        <div class="text-center font-handwriting text-2xl mb-4 text-neutral-300" style="font-family: 'Brush Script MT', cursive;">Why Picked</div>
        <div class="bg-[#F5E6C8] text-neutral-900 p-6 rounded-lg text-sm leading-relaxed text-left shadow-lg">
          {{ book.whyPicked }}
        </div>
      </div>

      <!-- Tags -->
      <div class="w-full max-w-2xl flex flex-wrap gap-2 mb-10 justify-center">
        <span
          v-for="(tag, i) in book.tags"
          :key="i"
          class="px-3 py-1 rounded-full text-xs font-bold"
          :class="[
            i % 3 === 0 ? 'bg-[#D4C4A8] text-neutral-800' :
            i % 3 === 1 ? 'bg-[#D8B4A6] text-neutral-800' :
            'bg-[#A8A4D4] text-neutral-800'
          ]"
        >
          # {{ tag }}
        </span>
      </div>

      <!-- Toggle Sections -->
      <div class="w-full max-w-2xl space-y-2 mb-10">
        <ToggleSection title="책 소개" :content="book.intro" />
        <ToggleSection title="작가 소개" :content="book.authorIntro" />
      </div>

      <!-- Comments -->
      <div class="w-full max-w-2xl text-left">
        <BookCommentList :comments="comments" />
      </div>

    </div>
  </main>
</template>
