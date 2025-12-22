<template>
  <div class="min-h-screen flex items-center justify-center bg-black text-white">
    <div class="text-center">
      <h2 class="text-xl mb-4">구글 로그인 처리 중...</h2>
      <p v-if="errorMsg" class="text-red-400">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const errorMsg = ref('')

onMounted(async () => {
  const code = route.query.code as string
  if (!code) {
    errorMsg.value = '인가 코드가 없습니다.'
    return
  }

  try {
    await auth.loginWithGoogle(code)
    // 로그인 성공 시 홈으로
    router.replace({ name: 'home' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      errorMsg.value = e.message
    } else {
      errorMsg.value = '로그인 실패'
    }
  }
})
</script>
