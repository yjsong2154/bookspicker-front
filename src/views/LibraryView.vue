<script setup lang="ts">
import { ref } from 'vue'
import BookCard from '@/components/book/BookCard.vue'

// UI 데모용 목업 데이터 (원하면 store.list로 바꿔도 됩니다)
const mock = Array.from({ length: 8 }).map((_, i) => ({
  id: `lib-${i + 1}`,
  title: `어떤 책 ${i + 1}`,
  author: '홍 길동',
  coverUrl: `https://picsum.photos/300/420?random=${20 + i}`,
  summary: '요약 텍스트가 들어갑니다. 두 줄 정도로 잘리는 레이아웃.',
  buyUrl: '#',
  canReadInline: true,
  genres: ['소설']
}))

// 탭 UI만 동작 (데이터 연동은 나중에)
const tabs = [
  { key: 'reading',  label: '읽는 중',    count: 3 },
  { key: 'finished', label: '완독',      count: 12 },
  { key: 'archive',  label: '보관함',    count: 5 },
  { key: 'notes',    label: '메모',      count: 0 },
  { key: 'high',     label: '하이라이트', count: 0 },
]
const active = ref<'reading'|'finished'|'archive'|'notes'|'high'>('reading')

// 검색/정렬은 UI만 표시
const q = ref('')
const sortKey = ref<'recent'|'title'|'author'>('recent')
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <!-- 헤더 -->
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-extrabold text-white">내 서재</h1>

      <div class="flex items-center gap-3">
        <!-- 검색 -->
        <label class="relative block">
          <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M13.293 12.293a8 8 0 1 0-1 1l4.207 4.207a1 1 0 0 0 1.414-1.414l-4.207-4.207zM8 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" clip-rule="evenodd"/>
          </svg>
          <input v-model="q" placeholder="서재 검색"
                 class="w-64 md:w-80 rounded-full bg-neutral-800 pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 outline-none ring-1 ring-neutral-700 focus:ring-neutral-500" />
        </label>

        <!-- 정렬 -->
        <select v-model="sortKey"
                class="rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-200 ring-1 ring-neutral-700 focus:outline-none">
          <option value="recent">최근 추가순</option>
          <option value="title">제목순</option>
          <option value="author">저자순</option>
        </select>
      </div>
    </div>

    <!-- 탭 -->
    <div class="mb-6 flex flex-wrap items-center gap-2">
      <button
        v-for="t in tabs"
        :key="t.key"
        @click="active = t.key as any"
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1"
        :class="active === t.key
          ? 'bg-white text-black ring-white'
          : 'bg-neutral-900 text-neutral-300 ring-neutral-700 hover:bg-neutral-800'">
        <span>{{ t.label }}</span>
        <span class="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300" :class="active===t.key ? 'bg-black/10 text-black' : ''">
          {{ t.count }}
        </span>
      </button>
    </div>

    <!-- 그리드: BookCard 재사용 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="b in mock" :key="b.id" class="group">
        <BookCard :book="b" />
        <!-- 카드 하단 행동(자리만) -->
        <div class="mt-3 flex items-center gap-2 text-sm">
          <button class="rounded-md px-3 py-1.5 bg-neutral-700 text-white hover:bg-neutral-600">읽기</button>
          <button class="rounded-md px-3 py-1.5 ring-1 ring-neutral-700 text-neutral-200 hover:bg-neutral-800">보관</button>
          <button class="ml-auto rounded-md px-3 py-1.5 ring-1 ring-neutral-700 text-neutral-200 hover:bg-neutral-800">삭제</button>
        </div>
      </div>
    </div>

    <!-- 빈 상태 (탭에 데이터 없을 때를 위한 예시) -->
    <div v-if="false" class="py-24 text-center text-neutral-400">
      이 탭에 표시할 항목이 없습니다. 도서 카드의 <span class="text-white font-semibold">추가</span> 버튼을 사용해 보세요.
    </div>

    <!-- 하단 페이징 자리 -->
    <div class="mt-10 flex items-center justify-center gap-2">
      <button class="rounded-md px-3 py-1.5 ring-1 ring-neutral-700 text-neutral-300 hover:bg-neutral-800">이전</button>
      <span class="text-sm text-neutral-400">1 / 5</span>
      <button class="rounded-md px-3 py-1.5 ring-1 ring-neutral-700 text-neutral-300 hover:bg-neutral-800">다음</button>
    </div>
  </main>
</template>
