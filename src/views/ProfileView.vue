<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ProfileBookList from '@/components/profile/ProfileBookList.vue'
import ProfileReviewList from '@/components/profile/ProfileReviewList.vue'
import WordCloud from '@/components/common/WordCloud.vue'
import { accountApi } from '@/api/accounts'
import { analysisApi, type AnalysisWordCloudItem } from '@/api/analysis'

const auth = useAuthStore()
const router = useRouter()

// 폼 상태
const email = ref<string>(auth.user?.email ?? '')
const nickname = ref<string>(auth.user?.nickname || auth.user?.name || '')
const isEditingNickname = ref(false)

interface Review {
  title: string
  author: string
  publisher: string
  date: string
  content: string
}

// 내가 쓴 리뷰 (API 연동)
interface ApiComment {
  book: {
    title: string
    publisher: string
  }
  created_at: string
  content: string
}

const myReviews = ref<Review[]>([])
const reviewLoading = ref(false)
const reviewError = ref(false)

async function fetchMyReviews() {
  reviewLoading.value = true
  reviewError.value = false
  try {
    const res = await accountApi.getComments({ limit: 5 })
    // API 응답 구조를 컴포넌트 형식에 맞게 변환
    myReviews.value = res.data.comments.map((c: ApiComment) => ({
      title: c.book.title,
      author: '', // API에서 저자 정보를 따로 주지 않으므로 일단 비움
      publisher: c.book.publisher,
      date: new Date(c.created_at).toLocaleDateString(),
      content: c.content
    }))
  } catch (err) {
    console.error('Failed to fetch reviews:', err)
    reviewError.value = true
  } finally {
    reviewLoading.value = false
  }
}

onMounted(() => {
  if (!auth.user || !auth.token) auth.loadFromStorage()
  if (!auth.user || !auth.token) {
    router.replace({ name: 'login', query: { redirect: '/profile' } })
  } else {
    fetchMyReviews()
    fetchBookLists()
    fetchWordCloud()
    // 초기값 동기화
    email.value = auth.user.email
    nickname.value = auth.user.nickname || auth.user.name
  }
})

async function saveNickname() {
  if (!auth.user) return
  if (!isEditingNickname.value) {
    isEditingNickname.value = true
    return
  }

  const next = nickname.value?.trim()
  if (!next) {
    alert('닉네임을 입력해주세요.')
    return
  }

  try {
    await accountApi.updateNickname({ nickname: next })
    auth.user = { ...auth.user, name: next, nickname: next }
    auth.persist()
    isEditingNickname.value = false
    alert('닉네임이 변경되었습니다.')
  } catch (err) {
    console.error('Failed to update nickname:', err)
    alert('닉네임 변경에 실패했습니다.')
  }
}

function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    auth.logout()
    router.replace({ name: 'login' })
  }
}

async function withdraw() {
  if (!confirm('정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.')) return

  try {
    await auth.resign(accountApi)
    alert('회원 탈퇴가 완료되었습니다.')
    router.replace({ name: 'login' })
  } catch (err) {
    console.error('Withdrawal failed:', err)
    alert('회원 탈퇴 중 오류가 발생했습니다.')
  }
}

// 워드 클라우드 상태
const wordCloudData = ref<AnalysisWordCloudItem[]>([])
const wordCloudLoading = ref(false)

async function fetchWordCloud() {
    if (!auth.user) return
    wordCloudLoading.value = true
    try {
        const res = await analysisApi.getWordCloud(parseInt(auth.user.id))
        wordCloudData.value = res.data
    } catch (e) {
        console.error(e)
    } finally {
        wordCloudLoading.value = false
    }
}

// 책 리스트 상태
interface ApiBook {
  title: string
  publisher: string
  cover_image: string
}

interface BookItem {
  title: string
  author: string
  publisher: string
  cover_image: string
}

const recentBooks = ref<BookItem[]>([])
const wishlistBooks = ref<BookItem[]>([])
const bookLoading = ref({ recent: false, wishlist: false })
const bookError = ref({ recent: false, wishlist: false })

async function fetchBookLists() {
  // 최근 읽은 책
  bookLoading.value.recent = true
  bookError.value.recent = false
  try {
    const res = await accountApi.getBookList('library', 5)
    recentBooks.value = res.data.books.map((b: ApiBook) => ({
      title: b.title,
      author: '', // API에 저자 정보 없음
      publisher: b.publisher,
      cover_image: b.cover_image
    }))
  } catch (err) {
    console.error('Failed to fetch recent books:', err)
    bookError.value.recent = true
  } finally {
    bookLoading.value.recent = false
  }

  // 찜한 책 (wishlist)
  bookLoading.value.wishlist = true
  bookError.value.wishlist = false
  try {
    const res = await accountApi.getBookList('wishlist', 5)
    wishlistBooks.value = res.data.books.map((b: ApiBook) => ({
      title: b.title,
      author: '',
      publisher: b.publisher,
      cover_image: b.cover_image
    }))
  } catch (err) {
    console.error('Failed to fetch wishlist books:', err)
    bookError.value.wishlist = true
  } finally {
    bookLoading.value.wishlist = false
  }
}
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
              <div class="flex items-center gap-4 flex-1 mr-4">
                <span class="text-sm font-bold w-12 text-neutral-400 shrink-0">닉네임</span>
                <input
                  v-if="isEditingNickname"
                  v-model="nickname"
                  type="text"
                  class="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-neutral-500"
                  @keyup.enter="saveNickname"
                  placeholder="새 닉네임 입력"
                />
                <span v-else class="text-lg font-medium truncate">{{ nickname || '닉네임 없음' }}</span>
              </div>
              <button @click="saveNickname" class="px-3 py-1 rounded-full border border-neutral-600 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors shrink-0">
                {{ isEditingNickname ? '저장' : '변경' }}
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

        <!-- 우측: 워드 클라우드 -->
        <div class="flex flex-col items-center justify-center border border-neutral-800 rounded-lg p-8 bg-neutral-900/30 min-h-[300px]">
          <div class="w-full h-full flex items-center justify-center" v-if="wordCloudLoading">
             <div class="text-neutral-500">Loading tags...</div>
          </div>
          <template v-else>
            <div class="w-full">
                <WordCloud :words="wordCloudData" />
            </div>
            <div class="mt-6 text-center">
                <h3 class="text-lg font-bold text-neutral-200 mb-1">나의 독서 키워드</h3>
                <p class="text-xs text-neutral-500">
                읽은 책들에서 발견된<br/>
                나만의 취향 태그
                </p>
            </div>
          </template>
        </div>
      </div>

      <!-- 중단: 책 리스트 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-20 border-t border-neutral-800 pt-12">
        <div @click="router.push('/library')" class="cursor-pointer group">
          <ProfileBookList
            title="최근 읽은 책"
            :books="recentBooks"
            :loading="bookLoading.recent"
            :error="bookError.recent"
            class="group-hover:opacity-80 transition-opacity"
          />
        </div>
        <div @click="router.push('/wishlist')" class="cursor-pointer group">
          <ProfileBookList
            title="'찜'한 책"
            :books="wishlistBooks"
            :loading="bookLoading.wishlist"
            :error="bookError.wishlist"
            class="group-hover:opacity-80 transition-opacity"
          />
        </div>
      </div>

      <!-- 하단: 리뷰 리스트 -->
      <div class="border-t border-neutral-800 pt-12">
        <ProfileReviewList
          :reviews="myReviews"
          :loading="reviewLoading"
          :error="reviewError"
        />
      </div>

      <!-- 탈퇴 버튼 -->
      <div class="mt-20 flex justify-center border-t border-neutral-900 pt-10 pb-20">
        <button
          @click="withdraw"
          class="text-xs text-neutral-700 hover:text-red-900/50 transition-colors"
        >
          회원 탈퇴
        </button>
      </div>

    </div>
  </main>
</template>
