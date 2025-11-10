<script setup lang="ts"></script>

<template>
  <footer class="mt-12 border-t border-neutral-800 bg-neutral-900 text-neutral-400">
    <div class="mx-auto max-w-6xl px-4 py-8">
      <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <!-- 브랜드 -->
        <div class="flex items-center gap-2 text-white">
          <span class="inline-flex h-6 w-6 rounded-md bg-yellow-400"></span>
          <span class="font-extrabold tracking-tight">BOOKSPICKER</span>
        </div>

        <!-- 링크 묶음 -->
        <div class="grid grid-cols-2 gap-6 text-sm md:grid-cols-3">
          <div class="space-y-2">
            <h3 class="text-neutral-300 font-semibold">서비스</h3>
            <router-link to="/" class="block hover:text-white">홈</router-link>
            <router-link to="/" class="block hover:text-white">카테고리</router-link>
            <router-link to="/" class="block hover:text-white">내 서재</router-link>
          </div>
          <div class="space-y-2">
            <h3 class="text-neutral-300 font-semibold">고객 지원</h3>
            <router-link to="/" class="block hover:text-white">FAQ</router-link>
            <router-link to="/" class="block hover:text-white">문의하기</router-link>
          </div>
          <div class="space-y-2">
            <h3 class="text-neutral-300 font-semibold">정책</h3>
            <router-link to="/" class="block hover:text-white">이용약관</router-link>
            <router-link to="/" class="block hover:text-white">개인정보 처리방침</router-link>
          </div>
        </div>
      </div>

      <p class="mt-8 text-xs text-neutral-500">
        © {{ new Date().getFullYear() }} BOOKSPICKER. All rights reserved.
      </p>
    </div>
  </footer>
</template>
