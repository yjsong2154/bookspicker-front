<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  categories: string[]          // 축 라벨
  values: number[]              // 0~100
  rings?: number                // 그리드 원 개수
}>(), { rings: 4 })

const size = 320
const cx = size / 2
const cy = size / 2
const radius = 120
const step = (2 * Math.PI) / props.categories.length

// 애니메이션을 위한 현재 값 상태
const currentValues = ref<number[]>(props.values.map(() => 0))

function animateValues() {
  const duration = 1000 // ms
  const start = performance.now()
  const startValues = currentValues.value.map(v => v)
  const endValues = props.values

  function frame(time: number) {
    const elapsed = time - start
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3)

    currentValues.value = startValues.map((s, i) => {
      const target = endValues[i] ?? 0
      return s + (target - s) * ease
    })

    if (progress < 1) {
      requestAnimationFrame(frame)
    }
  }

  requestAnimationFrame(frame)
}

onMounted(() => {
  animateValues()
})

watch(() => props.values, () => {
  animateValues()
}, { deep: true })

function p(angleIdx: number, rRatio: number) {
  const a = -Math.PI / 2 + step * angleIdx // 위쪽(12시)부터
  const r = radius * rRatio
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
}

function polyPoints() {
  return currentValues.value.map((v, i) => {
    const { x, y } = p(i, Math.max(0, Math.min(1, v / 100)))
    return `${x},${y}`
  }).join(' ')
}
</script>

<template>
  <svg :viewBox="`0 0 ${size} ${size}`" class="w-full h-auto">
    <!-- 그리드 링 -->
    <g v-for="r in rings" :key="r">
      <circle :cx="cx" :cy="cy" :r="(radius / rings) * r" class="fill-none stroke-neutral-800" />
    </g>

    <!-- 축 라인 + 라벨 -->
    <g v-for="(c, i) in categories" :key="c">
      <line
        :x1="cx" :y1="cy"
        :x2="p(i,1).x" :y2="p(i,1).y"
        class="stroke-neutral-700"
      />
      <text
        :x="p(i,1.12).x" :y="p(i,1.12).y"
        class="fill-neutral-300 text-[10px]"
        text-anchor="middle" dominant-baseline="middle"
      >{{ c }}</text>
    </g>

    <!-- 데이터 폴리곤 -->
    <polygon :points="polyPoints()" class="fill-cyan-500/30 stroke-cyan-400" />
    <!-- 데이터 점 -->
    <g v-for="(v,i) in currentValues" :key="i">
      <circle :cx="p(i, Math.max(0, Math.min(1, v/100))).x"
              :cy="p(i, Math.max(0, Math.min(1, v/100))).y"
              r="3" class="fill-cyan-300" />
    </g>
  </svg>
</template>
