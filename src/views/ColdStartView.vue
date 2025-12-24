<template>
  <div class="cold-start-container">
    <div class="logo-section">
      <h1 class="logo">BooksPicker</h1>
    </div>

    <transition name="fade-slide" mode="out-in">
      <!-- Step 1: Nickname -->
      <div v-if="step === 1" key="step1" class="step-card">
        <h2 class="step-title">앞으로 뭐라고<br/>불러드릴까요?</h2>

        <div class="nickname-guide">
          <p><strong>제한되는 닉네임</strong></p>
          <ul>
            <li>사회 통념에 어긋나는 부적절한 표현</li>
            <li>욕설, 음란성, 혐오성 단어 등 타인에게 불쾌감을 줄 수 있는 표현</li>
            <li>특정 정치인/종교 비하 등</li>
          </ul>
        </div>

        <div class="input-group">
          <div class="input-wrapper">
            <input
              v-model="nickname"
              type="text"
              placeholder="닉네임"
              class="nickname-input"
              @input="checkNickname"
            />
            <span v-if="isNicknameValid === true" class="valid-check">✓</span>
          </div>
          <p v-if="nicknameError" class="error-msg">{{ nicknameError }}</p>
        </div>

        <div class="nav-btns">
          <button class="btn prev" disabled>이전</button>
          <button class="btn next" :disabled="!isNicknameValid" @click="nextStep">다음</button>
        </div>
      </div>

      <!-- Step 2: Info -->
      <div v-else-if="step === 2" key="step2" class="step-card">
        <h2 class="step-title">몇 가지 정보를<br/>추가해볼까요?</h2>

        <div class="form-section">
          <select v-model="birthYear" class="year-select">
            <option value="" disabled>생년월 선택</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
          </select>

          <div class="gender-btns">
            <button
              :class="['gender-btn', { active: gender === 'F' }]"
              @click="gender = 'F'"
            >여자</button>
            <button
              :class="['gender-btn', { active: gender === 'M' }]"
              @click="gender = 'M'"
            >남자</button>
            <button
              :class="['gender-btn', { active: gender === 'N' }]"
              @click="gender = 'N'"
            >비공개</button>
          </div>

          <div class="slider-section">
            <p class="slider-label">🧐 최근 한 달 동안 책을 얼마나 읽으셨나요? <span>{{ readCount }}권</span></p>
            <input type="range" min="0" max="10" v-model="readCount" class="range-slider" />

            <div class="reading-type" :style="{ opacity: readCount > 0 ? 1 : 0.5 }">
              <p v-if="readCount <= 2">✨ 당신은 <strong>가끔 책을 찾아 읽는 소독서가</strong>예요.</p>
              <p v-else-if="readCount <= 5">📖 책과 함께 하루를 쌓아가는 당신, <strong>중독서가</strong>예요.</p>
              <p v-else>🌟 책은 당신의 일상 그 자체, <strong>진정한 다독서가</strong>예요.</p>
            </div>
          </div>
        </div>

        <div class="nav-btns">
          <button class="btn prev" @click="prevStep">이전</button>
          <button class="btn next" :disabled="!birthYear || !gender" @click="nextStep">다음</button>
        </div>
      </div>

      <!-- Step 4: Books -->
      <div v-else-if="step === 4" key="step4" class="step-card">
        <h2 class="step-title">최근에 읽었거나, 읽고 싶은 책이<br/>있다면 선택해주세요 (1개 이상)</h2>

        <div class="book-grid">
          <div
            v-for="book in availableBooks"
            :key="book.isbn"
            :class="['book-item', { active: selectedBookIsbns.includes(book.isbn) }]"
            @click="toggleBook(book.isbn)"
            :title="book.title"
          >
            <img :src="book.cover_image" :alt="book.title" />
            <div class="check-overlay" v-if="selectedBookIsbns.includes(book.isbn)">
              <div class="check-circle">✓</div>
            </div>
          </div>
        </div>

        <div class="nav-btns vertical">
          <button class="btn submit-btn" @click="nextStep" :disabled="selectedBookIsbns.length < 1">
            {{ selectedBookIsbns.length }}개 선택 (다음)
          </button>
          <button class="btn ghost" @click="prevStep">이전</button>
        </div>
      </div>

      <!-- Step 5: Loading -->
      <div v-else-if="step === 5" key="step5" class="step-card center">
        <h2 class="step-title">{{ nickname }}님의 취향을<br/>분석하고 있어요</h2>

        <div class="loading-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ progress }}%</p>
        </div>

        <div class="animation-placeholder">
          <div class="blob"></div>
        </div>
      </div>
    </transition>

    <div class="step-indicator" v-if="step < 5">
      {{ step }}/4
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { accountApi } from '@/api/accounts'
import { analysisApi } from '@/api/analysis'

const router = useRouter()
const auth = useAuthStore()

const step = ref(1)
const nickname = ref('')
const isNicknameValid = ref<boolean | null>(null)
const nicknameError = ref('')

const birthYear = ref('')
const gender = ref('')
const readCount = ref(3)

interface Book {
  isbn: string;
  title: string;
  cover_image: string;
  publisher: string;
}

const availableBooks = ref<Book[]>([])
const selectedBookIsbns = ref<string[]>([])

const progress = ref(0)
const years = Array.from({ length: 50 }, (_, i) => 2010 - i)

onMounted(async () => {
  try {
    // 1. 가입 여부 확인 (필요시)
    await auth.checkAuth(accountApi)
    if (auth.user?.is_coldstart_completed) {
      router.push('/')
      return
    }

    // 2. 데이터 미리 로드
    const { data } = await accountApi.getColdstartBooks()
    availableBooks.value = data.books
  } catch (err) {
    console.error('Failed to load coldstart data', err)
  }
})

const nextStep = () => {
  // Step 1 -> 2
  if (step.value === 1) {
    step.value = 2
    return
  }
  // Step 2 -> 4 (Step 3 Tags removed)
  if (step.value === 2) {
    step.value = 4
    return
  }
  // Step 4 -> 5 (Finish)
  if (step.value === 4) {
    step.value = 5
    startAnalysis()
    return
  }
}

const prevStep = () => {
  if (step.value === 4) {
    step.value = 2
    return
  }
  if (step.value > 1) step.value--
}

const checkNickname = () => {
  if (nickname.value.length < 2) {
    isNicknameValid.value = false
    nicknameError.value = '2자 이상 입력해주세요.'
    return
  }
  isNicknameValid.value = true
  nicknameError.value = ''
}

const toggleBook = (isbn: string) => {
  if (selectedBookIsbns.value.includes(isbn)) {
    selectedBookIsbns.value = selectedBookIsbns.value.filter(b => b !== isbn)
  } else if (selectedBookIsbns.value.length < 5) {
    selectedBookIsbns.value.push(isbn)
  }
}

const startAnalysis = async () => {
  // Start animation immediately
  let progressValue = 0
  const interval = setInterval(() => {
    if (progressValue < 90) {
      progressValue += 2
      progress.value = progressValue
    }
  }, 50)

  try {
    // 1. Backend Profile Update
    const accountCalls = [
      accountApi.setNickname({ nickname: nickname.value }),
      accountApi.setProfileInfo({
        profile_info: {
          birth_year: parseInt(birthYear.value),
          sex: gender.value,
          books_per_month: parseInt(readCount.value.toString())
        }
      }),
      accountApi.setPreferredBooks({ isbn_list: selectedBookIsbns.value })
    ]
    await Promise.all(accountCalls)

    // 2. Analysis Server Sync (Record Read History)
    // Don't let this block main flow critical path if possible, or keep it fast.
    if (auth.user?.id) {
        const userId = Number(auth.user.id)
        if (!isNaN(userId)) {
            await Promise.all(selectedBookIsbns.value.map(isbn =>
                analysisApi.recordReadHistory(userId, isbn)
            ))
            console.log('Synced cold start books to analysis server')
        }
    }

  } catch (err) {
    console.error('Failed to submit coldstart data', err)
  }

  // Finish animation
  clearInterval(interval)
  progress.value = 100
  completeColdStart()
}

const completeColdStart = async () => {
  await auth.checkAuth(accountApi)
  setTimeout(() => {
    router.push('/')
  }, 500)
}
</script>

<style scoped>
.cold-start-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  padding: 20px;
  font-family: 'Pretendard', sans-serif;
  color: #fff;
}

.logo-section {
  position: absolute;
  top: 40px;
  left: 60px;
}

.logo {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.step-card {
  width: 100%;
  max-width: 600px;
  background: #171717; /* neutral-900 */
  padding: 60px;
  border-radius: 24px;
  border: 1px solid #262626; /* neutral-800 */
  text-align: center;
  position: relative;
}

.step-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 40px;
  color: #fff;
}

/* Step 1 Styles */
.nickname-guide {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
  margin-bottom: 30px;
  color: #aaa;
}

.nickname-guide strong {
  color: #fdd835;
}

.nickname-guide ul {
  margin-top: 10px;
  padding-left: 20px;
}

.input-group {
  margin-bottom: 40px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.nickname-input {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #333;
  border-radius: 12px;
  font-size: 18px;
  outline: none;
  background: #222;
  color: #fff;
}

.nickname-input:focus {
  border-color: #555;
}

.valid-check {
  position: absolute;
  right: 15px;
  color: #4caf50;
  font-weight: bold;
}

.error-msg {
  color: #f44336;
  font-size: 12px;
  text-align: left;
  margin-top: 5px;
}

.check-btn {
  margin-top: 10px;
  font-size: 14px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

/* Step 2 Styles */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.year-select {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #333;
  font-size: 16px;
  background: #222;
  color: #fff;
  outline: none;
}

.gender-btns {
  display: flex;
  gap: 10px;
}

.gender-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #333;
  border-radius: 50px;
  background: #222;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.gender-btn.active {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.slider-section {
  text-align: left;
  margin-top: 20px;
}

.slider-label {
  font-size: 15px;
  margin-bottom: 15px;
  color: #eee;
}

.slider-label span {
  float: right;
  color: #6c5ce7;
  font-weight: bold;
}

.range-slider {
  width: 100%;
  margin: 20px 0;
  accent-color: #6c5ce7;
  background: #333;
}

.reading-type {
  background: #222;
  padding: 15px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  margin-top: 10px;
  color: #ccc;
}

.reading-type strong {
  color: #fff;
}

/* Step 3 Styles */
.sub-guide {
  font-size: 16px;
  color: #888;
  margin-top: -20px;
  margin-bottom: 30px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 40px;
}

.tag-item {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #333;
  background: #222;
  color: #888;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tag-item.active {
  background: #fdd835;
  border-color: #fdd835;
  color: #000;
  font-weight: 600;
}

/* Step 4 Styles */
.book-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 40px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.book-grid::-webkit-scrollbar {
  width: 6px;
}
.book-grid::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.book-item {
  position: relative;
  aspect-ratio: 2/3;
  background: #222;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.book-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.check-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-circle {
  width: 30px;
  height: 30px;
  background: #fff;
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Step 5 Styles */
.loading-container {
  margin: 40px 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #222;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #6c5ce7;
  transition: width 0.1s linear;
}

.progress-text {
  margin-top: 10px;
  font-weight: 600;
  color: #888;
}

.animation-placeholder {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob {
  width: 60px;
  height: 60px;
  background: #6c5ce7;
  border-radius: 50%;
  filter: blur(20px);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.5; }
}

/* Common Nav Btns */
.nav-btns {
  display: flex;
  gap: 15px;
  margin-top: 40px;
}

.nav-btns.vertical {
  flex-direction: column;
}

.btn {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn.next, .btn.submit-btn {
  background: #333;
  color: #666;
}

.btn.next:not(:disabled), .btn.submit-btn:not(:disabled) {
  background: #fff;
  color: #000;
}

.btn.prev {
  background: #222;
  color: #888;
}

.btn.ghost {
  background: none;
  color: #555;
}

.step-indicator {
  position: absolute;
  bottom: 60px;
  right: 60px;
  font-size: 14px;
  color: #555;
}

/* Animations */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
