<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import RadarDummy from '@/components/charts/RadarDummy.vue'
import ProfileBookList from '@/components/profile/ProfileBookList.vue'
import ProfileReviewList from '@/components/profile/ProfileReviewList.vue'

const auth = useAuthStore()
const router = useRouter()

// 로그인 상태 보장 (새로고침 대비)
onMounted(() => {
  if (!auth.user || !auth.token) auth.loadFromStorage()
  if (!auth.user || !auth.token) router.replace({ name: 'login', query: { redirect: '/profile' } })
})

// 폼 상태 (이메일은 읽기 전용, 닉네임만 편집)
const email = ref<string>(auth.user?.email ?? '')
const nickname = ref<string>(auth.user?.name ?? '')

function saveAll() {
  // 닉네임만 변경
  if (!auth.user) return
  const next = nickname.value?.trim() || auth.user.name
  auth.user = { ...auth.user, name: next }
  auth.persist()
  // 폼에 반영
  nickname.value = auth.user.name
  alert('저장되었습니다.')
}

function logout() {
  auth.logout()
  router.replace({ name: 'login' })
}

// 레이더 더미 데이터
const cats = ['감성', '역사', '성장', '미스터리', '판타지', '철학', '서사', '현실']
const vals = [72, 65, 58, 40, 83, 55, 68, 47] // 0~100

// 더미 데이터: 최근 읽은 책
const recentBooks = [
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
]

// 더미 데이터: 좋아요 한 책
const likedBooks = [
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
  { title: '나나 올리브에게', author: '루리', publisher: '문학동네' },
]

// 더미 데이터: 내가 쓴 리뷰
const myReviews = [
  {
    title: '나나 올리브에게',
    author: '루리',
    publisher: '문학동네',
    date: '2025-02-01',
    content: '책은 끝까지 읽고 나니 마음에 잔잔한 여운이 남네요. 읽는 동안 참 많은 생각이 스쳐 지나갔어요. 마지막 페이지를 덮고도 한참 여운이 남는 책이었습니다. 좋은 시간 보냈습니다.'
  },
  {
    title: '나나 올리브에게',
    author: '루리',
    publisher: '문학동네',
    date: '2025-02-01',
    content: '책은 끝까지 읽고 나니 마음에 잔잔한 여운이 남네요. 읽는 동안 참 많은 생각이 스쳐 지나갔어요. 마지막 페이지를 덮고도 한참 여운이 남는 책이었습니다. 좋은 시간 보냈습니다.'
  },
  {
    title: '나나 올리브에게',
    author: '루리',
    publisher: '문학동네',
    date: '2025-02-01',
    content: '책은 끝까지 읽고 나니 마음에 잔잔한 여운이 남네요. 읽는 동안 참 많은 생각이 스쳐 지나갔어요. 마지막 페이지를 덮고도 한참 여운이 남는 책이었습니다. 좋은 시간 보냈습니다.'
  },
]
</script>

<template>
  <main class="min-h-screen bg-black text-white">
    <div class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-4xl font-bold mb-12">Profile</h1>

      <!-- 상단: 유저 정보 & 레이더 차트 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <!-- 좌측: 유저 정보 -->
        <div class="flex flex-col items-center md:items-start justify-center">
          <!-- 아바타 -->
          <div class="w-40 h-40 rounded-full border-2 border-neutral-700 grid place-items-center mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <!-- 정보 필드 -->
          <div class="w-full max-w-sm space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="text-sm font-bold w-12 text-neutral-400">닉네임</span>
                <span class="text-lg font-medium">{{ nickname || '닉네임 없음' }}</span>
              </div>
              <button @click="saveAll" class="px-3 py-1 rounded-full border border-neutral-600 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors">
                변경
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="text-sm font-bold w-12 text-neutral-400">e-mail</span>
                <span class="text-sm text-neutral-300">{{ email }}</span>
              </div>
              <button class="px-3 py-1 rounded-full border border-neutral-600 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors cursor-not-allowed opacity-50">
                변경
              </button>
            </div>
          </div>

          <!-- 로그아웃 (임시 위치) -->
          <button @click="logout" class="mt-8 text-xs text-neutral-600 hover:text-neutral-400 underline">
            로그아웃
          </button>
        </div>

        <!-- 우측: 레이더 차트 -->
        <div class="flex flex-col items-center justify-center border border-neutral-800 rounded-lg p-8 bg-neutral-900/30">
          <div class="w-full max-w-[320px]">
            <RadarDummy :categories="cats" :values="vals" />
          </div>
          <div class="mt-6 text-center">
            <h3 class="text-lg font-bold text-neutral-200 mb-1">사색적 탐구 타입</h3>
            <p class="text-xs text-neutral-500">
              문장 속에 담긴 의미를 곱씹고<br/>
              사유하는 독자
            </p>
          </div>
        </div>
      </div>

      <!-- 중단: 책 리스트 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-20 border-t border-neutral-800 pt-12">
        <ProfileBookList title="최근 읽은 책" :books="recentBooks" />
        <ProfileBookList title="'좋아요'한 책" :books="likedBooks" />
      </div>

      <!-- 하단: 리뷰 리스트 -->
      <div class="border-t border-neutral-800 pt-12">
        <ProfileReviewList :reviews="myReviews" />
      </div>

    </div>
  </main>
</template>
