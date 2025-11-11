<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

async function onSubmit(e: Event) {
  e.preventDefault()
  errorMsg.value = null
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value.trim())
    const to = (route.query.redirect as string) || { name: 'home' }
    router.replace(to)
  } catch (e: any) {
    errorMsg.value = e?.message || '로그인 실패'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-[80vh] grid place-items-center px-4">
    <div class="w-full max-w-md rounded-2xl bg-neutral-900 p-8 ring-1 ring-neutral-800">
      <h1 class="mb-6 text-center text-2xl font-extrabold text-white">
        나도 몰랐던<br/>내가 좋아하는 책 찾기
      </h1>

      <form @submit="onSubmit" class="space-y-3">
        <label class="block">
          <span class="sr-only">이메일</span>
          <input
            v-model="email"
            type="email"
            placeholder="이메일"
            class="w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-200 ring-1 ring-neutral-700 placeholder:text-neutral-500 focus:outline-none focus:ring-neutral-500"
          />
        </label>

        <label class="block">
          <span class="sr-only">비밀번호</span>
          <input
            v-model="password"
            type="password"
            placeholder="비밀번호"
            class="w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-200 ring-1 ring-neutral-700 placeholder:text-neutral-500 focus:outline-none focus:ring-neutral-500"
          />
        </label>

        <button
          :disabled="loading"
          class="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {{ loading ? '로그인 중…' : '로그인' }}
        </button>

        <div v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</div>
      </form>

      <div class="mt-4 flex items-center justify-between text-sm text-neutral-400">
        <a class="hover:text-white" href="#">아이디/비밀번호 찾기</a>
        <a class="hover:text-white" href="#">회원가입</a>
      </div>
    </div>
  </main>
</template>
