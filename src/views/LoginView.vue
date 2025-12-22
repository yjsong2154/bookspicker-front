<script setup lang="ts">
import { ref } from 'vue'
// import { useAuthStore } from '@/stores/auth'

// const route = useRoute()
// const router = useRouter()
// const auth = useAuthStore()

const loading = ref(false)
const errorMsg = ref<string | null>(null)

const GOOGLE_CLIENT_ID = '34425994510-sar5l4o8k5hpdvh6fc9tt8s43i95adgp.apps.googleusercontent.com'
const GOOGLE_REDIRECT_URI = 'http://localhost:5173/google-login'

async function onGoogleLogin() {
  errorMsg.value = null
  loading.value = true
  try {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
       GOOGLE_CLIENT_ID +
       '&redirect_uri=' +
       GOOGLE_REDIRECT_URI +
       '&response_type=code' +
       '&scope=email profile openid'

    window.location.href = url
  } catch (e: unknown) {
    if (e instanceof Error) {
      errorMsg.value = e.message
    } else {
      errorMsg.value = '로그인 실패'
    }
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

      <div class="space-y-3">
        <button
          @click="onGoogleLogin"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 rounded-md bg-white py-2.5 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-60"
        >
          <!-- Google Icon -->
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google로 로그인
        </button>

        <div v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</div>
      </div>

      <!-- <div class="mt-4 flex items-center justify-center text-sm text-neutral-400">
        <router-link to="/signup" class="hover:text-white">회원가입</router-link>
      </div> -->
    </div>
  </main>
</template>
