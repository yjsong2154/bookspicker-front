<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import ePub from 'epubjs'

// ======= 설정 =======
const DEFAULT_EPUB_PATH = '/epubs/sample.epub'
const spreadMode: 'none' | 'auto' | 'always' = 'always' // 항상 양면 표시
const flowMode: 'paginated' | 'scrolled' = 'paginated'  // 페이지 단위 넘김

// ======= 상태 =======
const route = useRoute()
const viewerRef = ref<HTMLDivElement | null>(null)
const leftHotspotRef = ref<HTMLDivElement | null>(null)
const rightHotspotRef = ref<HTMLDivElement | null>(null)

let book: any = null
let rendition: any = null

// 페이지/위치 추적
const totalPages = ref<number>(0)
const currentPage = ref<number>(1)
const isReady = ref(false)
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)

const gotoInput = ref<string>('') // 페이지 점프 입력

// CFIs 기반 페이지 계산(Locations 사용)
async function setupLocations() {
  try {
    // 기준값(문자수/스냅샷)으로 위치 생성: 값이 작을수록 페이지 수가 늘어남
    await book.ready
    await book.locations.generate(1024)
    totalPages.value = book.locations.length() || 0
  } catch (e) {
    // fallback: locations 실패 시 스파인 길이로 근사
    totalPages.value = (book?.spine?.items?.length ?? 1) * 8 // 대략값
  }
}

// 현재 CFI를 -> 페이지 index 로 환산
function updateCurrentPageFromLocation(loc: any) {
  try {
    const cfi = loc?.start?.cfi || loc?.cfi || null
    if (!cfi || !book?.locations) return
    const idx = book.locations.locationFromCfi(cfi) // 0-based
    currentPage.value = Math.min(Math.max(1, idx + 1), totalPages.value || 1)
  } catch {
    // 실패 시 percentage로 근사
    const percentage = rendition?.currentLocation()?.start?.percentage || 0
    const approx = Math.round(percentage * (totalPages.value || 1))
    currentPage.value = Math.min(Math.max(1, approx || 1), totalPages.value || 1)
  }
}

function nextPage() {
  if (!rendition) return
  // 양면이라 한 번에 두 페이지 넘어가도록 두 번 호출
  rendition.next()
}
function prevPage() {
  if (!rendition) return
  rendition.prev()
}

async function goToPage() {
  if (!book || !book.locations) return
  const n = parseInt(gotoInput.value, 10)
  if (isNaN(n) || n < 1) return
  const target = Math.min(n, totalPages.value || 1)
  // locations는 0-based
  const cfi = book.locations.cfiFromLocation(target - 1)
  if (cfi) await rendition.display(cfi)
}

function handleResize() {
  // 리사이즈 시 spread가 잘 적용되도록 재설정
  if (!rendition) return
  try {
    rendition.resize()
  } catch {}
}

onMounted(async () => {
  try {
    isLoading.value = true

    // Query Param에서 URL 확인
    const urlParam = route.query.url as string | undefined
    const bookPath = urlParam || DEFAULT_EPUB_PATH

    // 책 로드
    book = ePub(bookPath)

    // 렌더러 생성
    rendition = book.renderTo(viewerRef.value!, {
      width: '100%',
      height: '100%',
      flow: flowMode,
      manager: 'default',  // 페이지 넘김(기본)
      spread: spreadMode,  // 양면
      allowScriptedContent: true,
    })

    // 테마/기본 스타일(검은 배경에 맞춤)
    rendition.themes.register('dark', {
      'body': { 'background': '#000', 'color': '#e5e5e5' },
      'img': { 'max-width': '100%', 'height': 'auto' }
    })
    rendition.themes.select('dark')

    // 첫 표시
    await rendition.display()

    // 위치 생성 후 페이지 수 계산
    await setupLocations()

    // 위치 변경 시 현재 페이지 업데이트
    rendition.on('relocated', (location: any) => {
      updateCurrentPageFromLocation(location)
    })

    // 링크 클릭 시 같은 뷰어 내에서 이동
    rendition.on('rendered', (_section: any) => {
      const iframes = viewerRef.value?.getElementsByTagName('iframe')
      if (iframes && iframes[0]) {
        const doc = (iframes[0] as HTMLIFrameElement).contentDocument
        if (doc) {
          doc.addEventListener('click', (ev: any) => {
            const t = ev.target as HTMLAnchorElement
            if (t?.tagName?.toLowerCase() === 'a' && t.getAttribute('href')) {
              ev.preventDefault()
              book.rendition.display(t.getAttribute('href')!)
            }
          })
        }
      }
    })

    // 좌/우 클릭 핫스팟
    leftHotspotRef.value?.addEventListener('click', prevPage)
    rightHotspotRef.value?.addEventListener('click', nextPage)

    window.addEventListener('resize', handleResize)

    // 첫 페이지 지표 반영
    const loc = rendition.currentLocation()
    updateCurrentPageFromLocation(loc)

    isReady.value = true
  } catch (e: any) {
    console.error(e)
    errorMsg.value = e?.message || 'EPUB 로드 중 오류가 발생했습니다.'
    console.error('EPUB load failed:', DEFAULT_EPUB_PATH, e)
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  try {
    leftHotspotRef.value?.removeEventListener('click', prevPage)
    rightHotspotRef.value?.removeEventListener('click', nextPage)
    window.removeEventListener('resize', handleResize)
    rendition?.destroy?.()
    book?.destroy?.()
  } catch {}
})
</script>

<template>
  <main class="min-h-screen bg-black text-white">
    <div class="mx-auto max-w-6xl px-4 py-6">
      <header class="mb-4 flex items-center justify-between">
        <h1 class="text-xl font-bold">EPUB Reader</h1>
        <div class="flex items-center gap-2 text-sm">
          <button class="rounded-md px-3 py-1.5 ring-1 ring-neutral-700 hover:bg-neutral-800" @click="prevPage">이전</button>
          <button class="rounded-md px-3 py-1.5 ring-1 ring-neutral-700 hover:bg-neutral-800" @click="nextPage">다음</button>
        </div>
      </header>

      <!-- 뷰어 영역 -->
      <section class="relative w-full overflow-hidden rounded-xl ring-1 ring-neutral-800 bg-neutral-950" style="height: 70vh;">
        <!-- 실제 epub.js가 렌더링되는 영역 -->
        <div ref="viewerRef" class="w-full h-full"></div>

        <!-- 좌/우 클릭 핫스팟 -->
        <div ref="leftHotspotRef"  class="absolute inset-y-0 left-0 w-1/2 cursor-pointer"></div>
        <div ref="rightHotspotRef" class="absolute inset-y-0 right-0 w-1/2 cursor-pointer"></div>

        <!-- 하단 상태바 -->
        <div class="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-4 py-2 flex items-center gap-3">
          <span class="text-sm text-neutral-300">
            {{ totalPages ? `${currentPage} / ${totalPages}` : (isReady ? '페이지 계산 중…' : '로딩 중…') }}
          </span>
          <div class="ml-auto flex items-center gap-2">
            <input
              v-model="gotoInput"
              type="number"
              min="1"
              :max="Math.max(1,totalPages || 1)"
              placeholder="페이지"
              class="w-24 rounded-md bg-neutral-800 px-2 py-1 text-sm text-neutral-200 ring-1 ring-neutral-700 focus:outline-none"
              @keydown.enter.prevent="goToPage"
            />
            <button
              class="rounded-md px-3 py-1.5 ring-1 ring-neutral-700 hover:bg-neutral-800 text-sm"
              @click="goToPage"
            >
              이동
            </button>
          </div>
        </div>
      </section>

      <p v-if="errorMsg" class="mt-3 text-red-400 text-sm">{{ errorMsg }}</p>
    </div>
  </main>
</template>

<style scoped>
/* 양면 기준으로 가운데 책등 느낌(옵션) */
:deep(.epub-container) {
  /* epub.js가 내부에 생성하는 컨테이너 클래스 처리용 (버전에 따라 다를 수 있음) */
}
</style>
