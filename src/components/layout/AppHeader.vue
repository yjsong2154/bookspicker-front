<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const q = ref('')
const router = useRouter()
function onSearch(e: Event) {
  e.preventDefault()
  // 검색 동작은 이후 연결. 일단 홈으로 이동
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="bg-neutral-900 text-white">
    <div class="mx-auto max-w-6xl px-4">
      <nav class="h-14 flex items-center gap-4">
        <!-- 로고 -->
        <router-link to="/" class="flex items-center gap-2">
          <span class="inline-flex h-6 w-6 rounded-md bg-yellow-400"></span>
          <span class="font-extrabold tracking-tight">BOOKSPICKER</span>
        </router-link>

        <!-- 메뉴 -->
        <ul class="hidden md:flex items-center gap-5 text-sm text-neutral-300">
          <li><router-link to="/" class="hover:text-white">홈</router-link></li>
          <li><router-link to="/" class="hover:text-white">카테고리</router-link></li>
          <li><router-link to="/" class="hover:text-white">내 서재</router-link></li>
        </ul>

        <!-- 우측: 검색 + 프로필 -->
        <div class="ml-auto flex items-center gap-3">
          <!-- 검색 -->
          <form @submit="onSearch" class="relative">
            <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M13.293 12.293a8 8 0 1 0-1 1l4.207 4.207a1 1 0 0 0 1.414-1.414l-4.207-4.207zM8 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" clip-rule="evenodd"/>
            </svg>
            <input
              v-model="q"
              placeholder="책 검색"
              class="w-64 md:w-80 rounded-full bg-neutral-800 pl-9 pr-10 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 outline-none ring-1 ring-neutral-700 focus:ring-neutral-500"
            />
            <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-xs rounded-full bg-neutral-700 text-neutral-200 hover:bg-neutral-600">
              검색
            </button>
          </form>

          <!-- 프로필 자리 표시자 -->
          <button class="h-8 w-8 rounded-full bg-neutral-800 ring-1 ring-neutral-700 hover:bg-neutral-700" aria-label="profile"></button>

          <!-- 모바일 메뉴 아이콘 (옵션) -->
          <button class="md:hidden p-2 rounded hover:bg-neutral-800" aria-label="menu">
            <svg class="h-5 w-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>
