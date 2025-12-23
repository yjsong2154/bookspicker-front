<script setup lang="ts">
import { ref } from 'vue'

// --- State Management ---

// Meta Info
const metaInfo = ref({
  title: '어둠의 눈치',
  subtitle: '',
  series: '',
  publisher: '북프렌즈',
  pubDate: '',
  pageCount: 43,
  language: 'ko',
  isbn: '1231231324566',
  genre: '한국소설',
  subGenre: '청소년',
  toc: '', // Table of Contents
  purchaseLink: 'www.naver.com'
})

// Author Info
interface Author {
  id: number
  name: string
  role: string
}

const authors = ref<Author[]>([
  { id: 1, name: '김지혜', role: '글쓴이' },
  { id: 2, name: '김지훈', role: '글쓴이' },
  { id: 3, name: '김아영', role: '그린이' },
  { id: 4, name: '김민지', role: '옮긴이' }
])

// AI Content
const aiContent = ref({
  summary: '',
  intro: '',
  features: '',
  tags: [] as string[]
})
const newTag = ref('')

// --- Methods ---

const handleCoverUpload = (event: Event) => {
  console.log('Cover upload triggered', event)
}

const handleEpubUpload = (event: Event) => {
  console.log('EPUB upload triggered', event)
}

const addAuthor = () => {
    // Placeholder for adding author logic
    console.log('Add author clicked')
}

const removeAuthor = (id: number) => {
  authors.value = authors.value.filter(a => a.id !== id)
}

const addTag = () => {
  if (newTag.value.trim()) {
    aiContent.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  aiContent.value.tags.splice(index, 1)
}

const save = () => {
  console.log('Saving data...', {
    meta: metaInfo.value,
    authors: authors.value,
    ai: aiContent.value
  })
  alert('저장되었습니다 (콘솔 확인)')
}

</script>

<template>
  <div class="min-h-screen bg-black text-white p-8 font-sans">
    <div class="max-w-5xl mx-auto space-y-12">

      <!-- Header -->
      <h1 class="text-3xl font-bold mb-8">Registration</h1>

      <!-- Section 1: Meta Info -->
      <section class="grid grid-cols-12 gap-8">
        <div class="col-span-12 mb-4">
          <h2 class="text-xl font-bold border-l-4 border-gray-500 pl-3">메타 정보</h2>
        </div>

        <!-- Left Column: Cover Image & File Uploads -->
        <div class="col-span-4 flex flex-col items-center gap-6">
            <!-- Cover Placeholder -->
            <div class="w-64 h-96 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden shadow-lg border border-gray-700">
                <!-- Placeholder Image or Logic to show uploaded image -->
                 <div class="text-center p-4">
                    <p class="text-gray-400 mb-2">어둠의 눈치</p>
                    <div class="w-32 h-48 bg-gray-600 mx-auto animate-pulse"></div>
                 </div>
            </div>

            <!-- Upload Inputs -->
            <div class="w-full space-y-3">
                <div class="flex items-center gap-3">
                    <span class="w-20 text-gray-400 text-sm">표지</span>
                    <input type="text" value="test_cover.jpg" readonly class="flex-1 bg-transparent border-b border-gray-600 text-sm py-1 focus:border-white transition-colors text-gray-300" />
                    <label class="cursor-pointer bg-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-600 transition">
                        파일 업로드
                        <input type="file" class="hidden" @change="handleCoverUpload" accept="image/*" />
                    </label>
                </div>
                <div class="flex items-center gap-3">
                    <span class="w-20 text-gray-400 text-sm">EPUB 파일</span>
                    <input type="text" value="example_book.epub" readonly class="flex-1 bg-transparent border-b border-gray-600 text-sm py-1 focus:border-white transition-colors text-gray-300" />
                     <label class="cursor-pointer bg-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-600 transition">
                        파일 업로드
                        <input type="file" class="hidden" @change="handleEpubUpload" accept=".epub" />
                    </label>
                </div>
                 <div class="flex items-center gap-3">
                    <span class="w-20 text-gray-400 text-sm">구매 링크</span>
                    <input v-model="metaInfo.purchaseLink" type="text" class="flex-1 bg-transparent border border-gray-600 px-2 py-1 text-sm rounded focus:border-white transition-colors" />
                </div>
            </div>
        </div>

        <!-- Right Column: Text Fields -->
        <div class="col-span-8 grid grid-cols-1 gap-y-4">

            <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">제목</label>
                <input v-model="metaInfo.title" type="text" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
            </div>

            <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">부제목</label>
                <input v-model="metaInfo.subtitle" type="text" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
            </div>

            <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">시리즈 명</label>
                <input v-model="metaInfo.series" type="text" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
            </div>

            <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">출판사</label>
                <input v-model="metaInfo.publisher" type="text" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
            </div>

             <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">출판일자</label>
                <input v-model="metaInfo.pubDate" type="date" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none text-white invert-schedule" />
            </div>

             <div class="flex items-center gap-4">
                 <div class="flex items-center gap-4 flex-1">
                    <label class="w-24 text-gray-400 font-medium">페이지 수</label>
                    <input v-model="metaInfo.pageCount" type="number" class="w-24 bg-transparent border border-gray-600 rounded px-2 py-2 focus:border-white transition-colors outline-none" />
                 </div>
                 <div class="flex items-center gap-4 flex-1 justify-end">
                    <label class="text-gray-400 font-medium">언어</label>
                    <select v-model="metaInfo.language" class="bg-transparent border border-gray-600 rounded px-2 py-2 w-32 focus:border-white transition-colors outline-none text-white">
                        <option value="ko" class="bg-black text-white">ko</option>
                        <option value="en" class="bg-black text-white">en</option>
                    </select>
                 </div>
            </div>

            <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">ISBN</label>
                <input v-model="metaInfo.isbn" type="text" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
            </div>

            <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">갈래</label>
                <div class="flex-1 flex gap-2">
                    <input v-model="metaInfo.genre" type="text" placeholder="대분류" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
                    <span class="text-gray-400 flex items-center">></span>
                    <input v-model="metaInfo.subGenre" type="text" placeholder="소분류" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
                    <button class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm">검색</button>
                </div>
            </div>

            <div class="flex gap-4">
                 <label class="w-24 text-gray-400 font-medium mt-2">목차</label>
                 <textarea v-model="metaInfo.toc" rows="4" placeholder="Mark Up 형식" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none resize-none"></textarea>
            </div>
        </div>
      </section>

      <div class="border-t border-gray-800"></div>

      <!-- Section 2: Author Info -->
      <section>
        <div class="flex justify-between items-center mb-6">
             <h2 class="text-xl font-bold border-l-4 border-gray-500 pl-3">작가 정보</h2>
             <div class="flex items-center gap-2">
                <button @click="addAuthor" class="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition">
                    <span>+</span> 새로운 작가 추가
                </button>
                <button class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition">?</button>
             </div>
        </div>

        <div class="grid grid-cols-12 gap-8">
            <!-- Author Search/List (Left) -->
             <div class="col-span-4">
                <div class="flex gap-2 mb-2">
                    <input type="text" placeholder="김" class="flex-1 bg-transparent border border-gray-600 px-3 py-2 rounded focus:border-white outline-none" />
                    <button class="bg-gray-300 text-black px-4 py-2 rounded font-bold hover:bg-white transition">추가</button>
                </div>
                <div class="border border-gray-600 rounded h-40 overflow-y-auto p-2 text-sm text-gray-300 space-y-1">
                    <div class="p-1 hover:bg-gray-800 cursor-pointer">김지혜 | ID | 생년월일</div>
                    <div class="p-1 hover:bg-gray-800 cursor-pointer">김지훈 | ID | 생년월일</div>
                    <div class="p-1 hover:bg-gray-800 cursor-pointer">김아영 | ID | 생년월일</div>
                    <div class="p-1 hover:bg-gray-800 cursor-pointer">김민지 | ID | 생년월일</div>
                </div>
             </div>

             <!-- Selected Authors (Right) -->
             <div class="col-span-8 space-y-3 pt-2">
                <div v-for="author in authors" :key="author.id" class="flex items-center gap-4 bg-gray-900 border border-gray-700 p-2 rounded-lg">
                    <div class="w-12 text-center text-xs bg-gray-800 rounded py-1 text-gray-400">대표</div>
                    <div class="text-gray-400">=</div> <!-- Drag handle icon replacement -->
                    <input type="text" v-model="author.name" class="flex-1 bg-gray-800 border-none rounded px-3 py-1 outline-none" readonly />
                    <select v-model="author.role" class="bg-gray-800 text-white border-none rounded px-2 py-1 outline-none text-sm">
                        <option value="글쓴이">글쓴이</option>
                        <option value="그린이">그린이</option>
                        <option value="옮긴이">옮긴이</option>
                    </select>
                    <button @click="removeAuthor(author.id)" class="px-4 py-1 bg-gray-700 hover:bg-red-900 rounded text-sm transition text-gray-300">삭제</button>
                </div>
             </div>
        </div>
      </section>

       <div class="border-t border-gray-800"></div>

      <!-- Section 3: AI Content -->
      <section>
        <div class="flex items-center gap-4 mb-6">
            <h2 class="text-xl font-bold text-gray-100 flex items-center gap-3">
                AI 기반 컨텐츠 생성
                <button class="text-sm bg-gray-300 text-black px-3 py-1 rounded hover:bg-white transition">생성 하기</button>
            </h2>
            <div class="flex-1 flex items-center gap-2">
                <div class="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                    <div class="w-3/4 h-full bg-gray-400"></div>
                </div>
                 <span class="text-xs text-gray-400">완료되었습니다</span>
            </div>
        </div>

        <div class="space-y-6">
             <!-- Summaries -->
            <div class="grid grid-cols-12 gap-4">
                <label class="col-span-2 text-gray-400 font-medium pt-2">요약 소개</label>
                <div class="col-span-10">
                    <textarea v-model="aiContent.summary" rows="3" class="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-white transition-colors outline-none resize-none"></textarea>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
                <label class="col-span-2 text-gray-400 font-medium pt-2">전체 소개</label>
                <div class="col-span-10">
                     <textarea v-model="aiContent.intro" rows="3" class="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-white transition-colors outline-none resize-none"></textarea>
                </div>
            </div>

             <div class="grid grid-cols-12 gap-4">
                <label class="col-span-2 text-gray-400 font-medium pt-2">도서 특징</label>
                <div class="col-span-10">
                     <textarea v-model="aiContent.features" rows="4" class="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-white transition-colors outline-none resize-none"></textarea>
                </div>
            </div>

            <!-- Tags -->
             <div class="grid grid-cols-12 gap-4">
                <label class="col-span-2 text-gray-400 font-medium pt-2">태그</label>
                <div class="col-span-10 space-y-2">
                    <div class="flex flex-wrap gap-2 mb-2">
                        <span class="px-3 py-1 bg-gray-800 rounded-full border border-gray-600 text-sm flex items-center gap-2 text-gray-300">
                           # 성장소설 <button class="hover:text-white">×</button>
                        </span>
                        <span class="px-3 py-1 bg-gray-800 rounded-full border border-gray-600 text-sm flex items-center gap-2 text-gray-300">
                           # 청소년 <button class="hover:text-white">×</button>
                        </span>
                        <span v-for="(tag, idx) in aiContent.tags" :key="idx" class="px-3 py-1 bg-gray-800 rounded-full border border-gray-600 text-sm flex items-center gap-2 text-gray-300">
                           # {{ tag }} <button @click="removeTag(idx)" class="hover:text-white">×</button>
                        </span>
                    </div>
                    <input v-model="newTag" @keyup.enter="addTag" type="text" placeholder="태그 추가 (Enter)" class="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-white transition-colors outline-none" />
                </div>
            </div>
        </div>
      </section>

      <!-- Footer Buttons -->
      <div class="flex justify-end gap-3 pt-8 pb-12">
        <button class="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition">취소</button>
        <button @click="save" class="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 border border-gray-600 transition">임시 저장</button>
        <button @click="save" class="px-6 py-2 bg-gray-500 hover:bg-gray-400 text-black font-bold rounded transition">저장</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

/* Date picker icon inversion for dark mode */
::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
}
</style>
