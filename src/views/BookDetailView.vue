<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookApi, type BookDetailResponse } from '@/api/books'

const route = useRoute()
const router = useRouter()
const isbn = route.params.isbn as string

const bookData = ref<BookDetailResponse['book'] | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const isDescriptionExpanded = ref(false)
const isAuthorIntroExpanded = ref(false)

const toggleDescription = () => (isDescriptionExpanded.value = !isDescriptionExpanded.value)
const toggleAuthorIntro = () => (isAuthorIntroExpanded.value = !isAuthorIntroExpanded.value)

const fetchBook = async () => {
  loading.value = true
  try {
    const res = await bookApi.getBookDetail(isbn)
    console.log(res.data.book)
    bookData.value = res.data.book
  } catch (e) {
    console.error(e)
    error.value = "책 정보를 불러오는데 실패했습니다."
  } finally {
    loading.value = false
  }
}

// User requested Heart button to track is_wished
const toggleHeart = async () => {
    if (!bookData.value) return
    try {
        const res = await bookApi.toggleWishlist(isbn)
        bookData.value.is_wished = res.data.is_wished
        // Note: is_wished usually doesn't return like_count, but check API if needed.
        // If the heart button was originally 'like', we might need to be careful.
        // But user explicitly said "Heart is is_wished value".
    } catch (e) {
        console.error(e)
    }
}

const goToPurchase = () => {
    if (bookData.value?.action_urls?.purchase_url) {
        window.open(bookData.value.action_urls.purchase_url, '_blank')
    } else {
        alert("구매 링크가 없습니다.")
    }
}

const readNow = () => {
    // Navigate to reader
    router.push({ name: 'reader', query: { isbn: isbn } })
}

onMounted(() => {
  fetchBook()
})
</script>

<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="text-white">Loading...</div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center">
     <div class="text-red-500">{{ error }}</div>
  </div>

  <div v-else-if="bookData" class="min-h-screen pb-20 relative overflow-hidden bg-[#121212] text-white">

    <!-- Background Gradient/Blur -->
    <div class="absolute top-0 left-0 w-full h-[500px] z-0 pointer-events-none">
        <div class="w-full h-full bg-gradient-to-b from-[#1a2a3a] to-[#121212] opacity-80"></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 pt-8 max-w-2xl">

      <!-- Top Section -->
      <div class="flex flex-col items-center mb-10">
        <!-- Book Cover -->
        <div class="w-48 h-72 shadow-2xl rounded-sm overflow-hidden mb-6 relative group">
             <img :src="bookData.cover_image" :alt="bookData.title" class="w-full h-full object-cover" />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-4 mb-8">
            <!-- Heart Button: Tracks is_wished -->
            <button @click="toggleHeart" class="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition">
                <span v-if="bookData.is_wished" class="text-red-500">❤️</span>
                <span v-else>♡</span>
            </button>

            <!-- Cart Button: Purchase URL -->
            <button @click="goToPurchase" class="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 transition">
                 <span>🛒</span>
            </button>

            <!-- Read Now Button -->
            <button @click="readNow" class="px-6 py-2 rounded-full bg-gray-200 text-black font-medium hover:bg-white transition flex items-center gap-2">
                📖 지금 읽기
            </button>
        </div>

        <!-- Info -->
        <div class="text-center w-full">
            <div class="text-gray-400 text-sm mb-1">
                {{ bookData.genre_path }}
            </div>
            <h1 class="text-3xl font-bold mb-2">{{ bookData.title }} <span class="text-gray-500 text-lg font-normal">☁ {{ bookData.like_count }}</span></h1>
            <div class="text-gray-400 text-sm mb-1">
                {{ bookData.published_date }}
            </div>
            <div class="flex items-center justify-center gap-2 text-gray-300 font-medium">
                <span>{{ bookData.authors?.[0]?.name }}</span>
                <span>·</span>
                <span>{{ bookData.publisher }}</span>
            </div>
        </div>
      </div>

      <!-- Why Picked Section -->
      <div v-if="bookData.why_picked" class="mb-12">
        <h2 class="text-center font-handwriting text-3xl mb-4 text-white uppercase tracking-widest" style="font-family: 'Brush Script MT', cursive;">Why Picked</h2>
        <div class="bg-[#fdf6d9] text-black p-6 rounded-sm shadow-md relative transform rotate-1 mb-6">
            <p class="leading-relaxed whitespace-pre-line text-black text-sm md:text-base font-medium">
                {{ bookData.why_picked.body }}
              </p>
        </div>

        <!-- Tags below the note -->
        <div class="flex flex-wrap justify-center gap-2">
            <template v-if="bookData.book_tags && bookData.book_tags.length > 0">
                <span v-for="tag in bookData.book_tags" :key="tag"
                    class="px-3 py-1 rounded-full bg-[#2a2a2a] text-[#b0b0b0] text-sm font-medium flex items-center gap-1 border border-[#3a3a3a] shadow-sm">
                    # {{ tag }}
                </span>
            </template>
            <span v-else class="px-3 py-1 rounded-full bg-[#2a2a2a] text-[#777] text-sm font-medium border border-[#3a3a3a]">
                # 태그 없음
            </span>
        </div>
      </div>

      <!-- Info Sections -->
      <div class="space-y-8 mb-12">
        <!-- Book Intro -->
        <section>
            <h3 class="flex items-center text-xl font-bold mb-4 cursor-pointer select-none" @click="toggleDescription">
                <span class="mr-2 transform transition-transform" :class="{'rotate-90': isDescriptionExpanded}">▶</span> 책 소개
            </h3>
            <div v-show="isDescriptionExpanded" class="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {{ bookData.description || '책 소개가 없습니다.' }}
            </div>
        </section>

        <!-- Author Intro -->
        <section>
            <h3 class="flex items-center text-xl font-bold mb-4 cursor-pointer select-none" @click="toggleAuthorIntro">
                <span class="mr-2 transform transition-transform" :class="{'rotate-90': isAuthorIntroExpanded}">▶</span> 작가 소개
            </h3>
             <div v-show="isAuthorIntroExpanded" class="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {{ bookData.authors?.[0]?.bio || '작가 소개가 없습니다.' }}
            </div>
        </section>
      </div>

      <!-- Reviews Section -->
      <section class="mb-20">
        <!-- Review Item -->
        <div v-if="bookData.comments && bookData.comments.length > 0">
             <div v-for="comment in bookData.comments" :key="comment.id" class="flex gap-4 mb-6">
                <div class="w-10 h-10 rounded-full bg-gray-700 shrink-0"></div> <!-- Avatar Placeholder -->
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-bold">{{ comment.user?.nickname || 'Unknown' }}</span>
                        <span class="text-xs text-gray-500">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
                    </div>
                    <p class="text-gray-300 text-sm leading-relaxed mb-2">
                        {{ comment.content }}
                    </p>
                </div>
            </div>
        </div>
        <div v-else class="text-center text-gray-500 py-10">
            아직 작성된 리뷰가 없습니다.
        </div>
      </section>

      <div class="text-center text-gray-500 text-sm cursor-pointer hover:text-white transition">
        더 보기
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.font-handwriting {
    font-family: 'Permanent Marker', cursive, sans-serif;
}
</style>
