<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import RadarDummy from '@/components/charts/RadarDummy.vue'

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
</script>

<template>
  <!-- 공통: 검은 배경 -->
  <main class="min-h-screen bg-black text-white">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <h1 class="text-3xl font-extrabold mb-8">Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- 좌측: 정보 폼 -->
        <section class="rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 p-6">
          <div class="space-y-5">
            <div>
              <label class="block text-sm text-neutral-300 mb-1">Nickname</label>
              <input
                v-model="nickname"
                type="text"
                placeholder="닉네임"
                class="w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-200 ring-1 ring-neutral-700 placeholder:text-neutral-500 focus:outline-none focus:ring-neutral-500"
              />
            </div>

            <div>
              <label class="block text-sm text-neutral-300 mb-1">Email</label>
              <input
                v-model="email"
                type="email"
                disabled
                class="w-full rounded-md bg-neutral-800/60 px-3 py-2 text-neutral-400 ring-1 ring-neutral-700 cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-neutral-500">로그인 이메일은 변경하지 않습니다.</p>
            </div>

            <!-- 추가 입력 칸 자리만 -->
            <div>
              <label class="block text-sm text-neutral-300 mb-1">소개 (옵션)</label>
              <input
                type="text"
                placeholder="한 줄 소개"
                class="w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-200 ring-1 ring-neutral-700 placeholder:text-neutral-500 focus:outline-none focus:ring-neutral-500"
              />
            </div>

            <div class="pt-2 flex flex-col gap-3">
              <button
                class="w-full rounded-md bg-white text-black font-semibold py-2 hover:bg-neutral-200"
                @click="saveAll"
              >
                SAVE ALL
              </button>
              <button
                class="w-full rounded-md ring-1 ring-neutral-700 text-neutral-200 py-2 hover:bg-neutral-800"
                @click="logout"
              >
                로그아웃
              </button>
            </div>
          </div>
        </section>

        <!-- 우측: 레이더 차트 -->
        <section class="rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 p-6">
          <h2 class="text-lg font-semibold mb-4 text-neutral-200">나의 취향 레이더 (더미)</h2>
          <RadarDummy :categories="cats" :values="vals" />
          <div class="mt-4 text-sm text-neutral-400">
            * 실제 추천/독서 기록과 연결하여 자동 생성 예정입니다.
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
