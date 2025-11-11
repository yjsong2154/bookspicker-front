<!-- src/views/PrivacyView.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => router.back()
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-neutral-200">
    <!-- 뒤로가기 -->
    <button
      @click="goBack"
      class="mb-6 inline-flex items-center gap-2 rounded-md px-3 py-2 ring-1 ring-neutral-700 hover:bg-neutral-800"
      aria-label="뒤로가기"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.293 4.293a1 1 0 010 1.414L8.414 10l3.879 4.293a1 1 0 01-1.414 1.414l-4.5-5a1 1 0 010-1.414l4.5-5a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
      뒤로가기
    </button>

    <h1 class="text-2xl font-extrabold text-white">개인정보 처리방침</h1>
    <p class="mt-1 text-sm text-neutral-400">최종 업데이트: 2025-11-11</p>

    <section class="prose prose-invert mt-6 max-w-none">
      <h2>1. 수집하는 개인정보 항목</h2>
      <ul>
        <li>필수: 이메일, 닉네임, 서비스 이용기록, 접속 로그, 쿠키</li>
        <li>선택: 프로필 이미지, 관심 장르</li>
      </ul>

      <h2>2. 수집 및 이용 목적</h2>
      <ul>
        <li>회원 관리, 서비스 제공 및 개선, 맞춤형 추천, 고객 응대</li>
        <li>보안·부정이용 방지, 법령 준수</li>
      </ul>

      <h2>3. 보유 및 이용기간</h2>
      <p>회원 탈퇴 시 지체 없이 파기합니다. 다만 법령에서 정한 기간 동안 거래기록 등은 보관합니다.</p>

      <h2>4. 제3자 제공 및 처리위탁</h2>
      <p>법령에 근거하거나 이용자 동의가 있는 경우에 한하여 제공·위탁하며, 수탁사와는 안전성 확보 조치를 위한 계약을 체결합니다.</p>

      <h2>5. 이용자 권리</h2>
      <p>이용자는 개인정보 열람·정정·삭제·처리정지를 요구할 수 있으며, 문의 접수 시 법정 기한 내 조치합니다.</p>

      <h2>6. 쿠키 사용</h2>
      <p>서비스 품질 개선과 맞춤형 제공을 위해 쿠키를 사용할 수 있으며, 브라우저 설정으로 저장을 거부할 수 있습니다.</p>

      <h2>7. 안전성 확보조치</h2>
      <ul>
        <li>암호화 저장, 접근권한 최소화, 로그·모니터링, 정기적 취약점 점검</li>
      </ul>

      <h2>8. 개인정보 보호책임자</h2>
      <p>문의: privacy@bookspicker.example (예시) / 접수된 요청은 관련 법령에 따라 처리합니다.</p>

      <h2>9. 고지의 의무</h2>
      <p>방침 내용이 변경되는 경우, 변경 사항을 사전 공지합니다.</p>
    </section>
  </main>
</template>
