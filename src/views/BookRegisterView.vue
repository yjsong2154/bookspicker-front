<script setup lang="ts">
import { ref } from 'vue'
import { analysisApi } from '@/api/analysis'
import axios from 'axios'

// --- State Management ---

// Meta Info
const metaInfo = ref({
  isbn: '',
  title: '',
  subtitle: '',
  publisher: '',
  longDescription: '',
  coverUrl: 'http://placeholder.com/cover.jpg', // Dummy default for now
  epubUrl: 'http://placeholder.com/book.epub', // Dummy default for now
  pubDate: '', // 8 digit string
  pageCount: 0,
  series: '',
  language: 'ko',
  toc: '',
  buyUrl: '',
  genreId: 0,
  whyPicked: '',
  shortDescription: ''
})
const coverFile = ref<File | null>(null)
const epubFile = ref<File | null>(null)


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
  tags: [] as string[],
  vector: [] as number[],
  isAnalyzing: false
})
const newTag = ref('')

// --- Methods ---

import api from '@/api' // Import main API

const handleCoverUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
      coverFile.value = file
      metaInfo.value.coverUrl = `http://temp/${file.name}` // Dummy URL
  }
}

const handleEpubSelection = (event: Event) => { // Renamed from handleEpubAnalysis if it was for *selection*
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
      epubFile.value = file
      metaInfo.value.epubUrl = `http://temp/${file.name}` // Dummy URL
  }
}

const runAiAnalysis = async () => {
  if (!epubFile.value) {
      alert('EPUB 파일을 먼저 선택해주세요.')
      return
  }

  aiContent.value.isAnalyzing = true
  try {
    // 2. Call AI Server
    const response = await analysisApi.analyzeEpub(epubFile.value)
    console.log('AI Analysis Result:', response.data)

    // 3. Update State
    const { tags, vector } = response.data
    if (tags) {
    if (tags) {
        aiContent.value.tags = processTags(tags)
    }
    }
    if (vector) {
        aiContent.value.vector = vector
    }

    alert('AI 분석이 완료되었습니다. (Tags & Vector check)')

  } catch (error) {
    console.error('AI Analysis Failed:', error)
    alert('AI 분석에 실패했습니다.')
  } finally {
    aiContent.value.isAnalyzing = false
  }
}

const processTags = (rawTags: Record<string, Record<string, number>>) => {
  const priorityCats = [
    'emotional_impact',
    'primary_genres',
    'style_descriptors',
    'tone_mood',
    'main_subjects',
    'main_topics',
    'primary_locales',
    'structure_features',
    'subgenres'
  ]

  const finalTags: string[] = []
  const seenTags = new Set<string>()

  // 1. Priority Extraction
  priorityCats.forEach(cat => {
    if (rawTags[cat]) {
      // Find max score tag
      let maxScore = -Infinity
      let bestTag = ''
      Object.entries(rawTags[cat]).forEach(([t, s]) => {
        if (s > maxScore) {
          maxScore = s
          bestTag = t
        }
      })
      if (bestTag && !seenTags.has(bestTag)) {
        finalTags.push(bestTag)
        seenTags.add(bestTag)
      }
    }
  })

  // 2. Remaining Tags
  const remaining: Array<{ t: string, s: number }> = []

  Object.entries(rawTags).forEach(([cat, tagsMap]) => {
    if (cat === 'content_warnings') return // Exclude

    Object.entries(tagsMap).forEach(([t, s]) => {
      if (!seenTags.has(t)) {
        remaining.push({ t, s })
        seenTags.add(t)
      }
    })
  })

  // Sort remaining by score descending
  remaining.sort((a, b) => b.s - a.s)

  remaining.forEach(fp => finalTags.push(fp.t))

  return finalTags
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

const save = async () => {
  if (!metaInfo.value.isbn || !metaInfo.value.title || !metaInfo.value.publisher || !metaInfo.value.pubDate) {
      alert('필수 정보를 입력해주세요 (ISBN, 제목, 출판사, 출판일자 등)')
      return
  }

  // Date Formatting: 20231225 -> 2023-12-25
  const d = metaInfo.value.pubDate
  let formattedDate = d
  if (d.length === 8) {
      formattedDate = `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`
  } else {
      alert('출판일자는 YYYYMMDD 8자리로 입력해주세요.')
      return
  }

  // Payload Construction
  const payload = {
      isbn: metaInfo.value.isbn,
      title: metaInfo.value.title,
      subtitle: metaInfo.value.subtitle,
      publisher: metaInfo.value.publisher,
      published_date: formattedDate,
      page_count: metaInfo.value.pageCount,
      series_name: metaInfo.value.series,
      lang: metaInfo.value.language,
      purchase_link: metaInfo.value.buyUrl,
      genre_child_id: Number(metaInfo.value.genreId), // Ensure number
      cover_image: metaInfo.value.coverUrl,
      epub_file: metaInfo.value.epubUrl,

      // New Fields
      abstract_descript: metaInfo.value.shortDescription,
      full_descript: metaInfo.value.longDescription,
      top_tags: aiContent.value.tags,
      recommendation_refer: [metaInfo.value.whyPicked], // List[str]

      // Complex Fields (Mocking logic for now as requested)
      toc: metaInfo.value.toc ? [{ "label": "Full Text", "href": "text.html" }] : [], // Simplification
      contributors: authors.value.map(a => ({
          name: a.name,
          role: a.role === '글쓴이' ? 'AUTHOR' : (a.role === '옮긴이' ? 'TRANSLATOR' : (a.role === '그림' ? 'ILLUSTRATOR' : 'ETC')),
          is_primary: a.id === 1 // Mock primary logic: first one is primary
      }))
  }

  console.log('Sending Payload:', payload)

  try {
      const resp = await api.post('/api/admin/books/', payload)
      if (resp.status === 201) {
          alert('저장되었습니다.')
          /* Optional: Navigate away or reset form */
      }
  } catch (e: unknown) {
      console.error('Save Failed:', e)
      let msg = ''
      if (axios.isAxiosError(e) && e.response?.data?.message) {
          msg = e.response.data.message
      } else if (e instanceof Error) {
          msg = e.message
      }
      alert(`저장 실패: ${msg}`)
  }
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
            <!-- Cover Preview -->
            <div class="w-64 h-96 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden shadow-lg border border-gray-700 relative group">
                 <img v-if="metaInfo.coverUrl" :src="metaInfo.coverUrl" class="w-full h-full object-cover" />
                 <div v-else class="text-center p-4">
                    <p class="text-gray-400 mb-2">No Cover</p>
                    <div class="w-32 h-48 bg-gray-600 mx-auto animate-pulse"></div>
                 </div>
            </div>

            <!-- Upload Inputs -->
            <div class="w-full space-y-3">
                <div class="flex items-center gap-3">
                    <span class="w-20 text-gray-400 text-sm">표지 파일</span>
                    <input type="text" :value="coverFile?.name || '선택 안됨'" readonly class="flex-1 bg-transparent border-b border-gray-600 text-sm py-1 text-gray-300" />
                    <label class="cursor-pointer bg-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-600 transition">
                        파일 찾기
                        <input type="file" class="hidden" @change="handleCoverUpload" accept="image/*" />
                    </label>
                </div>
                 <div class="flex items-center gap-3">
                    <span class="w-20 text-gray-400 text-sm">EPUB 파일</span>
                    <input type="text" :value="epubFile?.name || '선택 안됨'" readonly class="flex-1 bg-transparent border-b border-gray-600 text-sm py-1 text-gray-300" />
                     <label class="cursor-pointer bg-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-600 transition">
                        파일 찾기
                        <input type="file" class="hidden" @change="handleEpubSelection" accept=".epub" />
                    </label>
                </div>
                 <div class="flex items-center gap-3">
                    <span class="w-20 text-gray-400 text-sm">구매 링크</span>
                    <input v-model="metaInfo.buyUrl" type="text" class="flex-1 bg-transparent border border-gray-600 px-2 py-1 text-sm rounded focus:border-white transition-colors" />
                </div>
            </div>
        </div>

        <!-- Right Column: Text Fields -->
        <div class="col-span-8 grid grid-cols-1 gap-y-4">

            <div class="flex items-center gap-4">
                <label class="w-24 text-gray-400 font-medium">ISBN</label>
                <input v-model="metaInfo.isbn" type="text" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
            </div>

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
                <input v-model="metaInfo.pubDate" type="text" placeholder="YYYYMMDD (8자리)" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" maxlength="8" />
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
                <label class="w-24 text-gray-400 font-medium">장르 ID</label>
                <input v-model="metaInfo.genreId" type="number" class="w-24 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none" />
            </div>

            <div class="flex gap-4">
                 <label class="w-24 text-gray-400 font-medium mt-2">짧은 소개</label>
                 <textarea v-model="metaInfo.shortDescription" rows="3" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none resize-none"></textarea>
            </div>

             <div class="flex gap-4">
                 <label class="w-24 text-gray-400 font-medium mt-2">긴 소개</label>
                 <textarea v-model="metaInfo.longDescription" rows="5" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none resize-none"></textarea>
            </div>

             <div class="flex gap-4">
                 <label class="w-24 text-gray-400 font-medium mt-2">Why Picked</label>
                 <textarea v-model="metaInfo.whyPicked" rows="3" class="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 focus:border-white transition-colors outline-none resize-none"></textarea>
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
                AI 기반 분석 (Tags & Vector)
            </h2>
            <div class="flex-1"></div>
            <label class="cursor-pointer flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition" @click.prevent="runAiAnalysis">
                <span v-if="aiContent.isAnalyzing" class="animate-pulse">분석 중...</span>
                <span v-else>선택된 EPUB 분석 실행</span>
            </label>
        </div>

        <div class="space-y-6">
            <!-- Vector Status -->
             <div class="grid grid-cols-12 gap-4">
                <label class="col-span-2 text-gray-400 font-medium pt-2">Vector</label>
                <div class="col-span-10 flex items-center">
                    <div v-if="aiContent.vector.length > 0" class="text-green-400 text-sm">
                        ✅ Calculated (Size: {{ aiContent.vector.length }})
                    </div>
                    <div v-else class="text-gray-600 text-sm">
                        Not calculated yet
                    </div>
                </div>
            </div>

            <!-- Tags -->
             <div class="grid grid-cols-12 gap-4">
                <label class="col-span-2 text-gray-400 font-medium pt-2">태그</label>
                <div class="col-span-10 space-y-2">
                    <div class="flex flex-wrap gap-2 mb-2">
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
