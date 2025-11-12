<!-- src/views/TermsView.vue -->
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

    <h1 class="text-2xl font-extrabold text-white">이용약관</h1>
    <p class="mt-1 text-sm text-neutral-400">최종 업데이트: 2025-11-11</p>

    <section class="prose prose-invert mt-6 max-w-none">
      <h2>1. 목적</h2>
      <p>본 약관은 BOOKSPICKER(이하 “회사”)가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>

      <h2>2. 용어의 정의</h2>
      <ul>
        <li>“서비스”: 회사가 제공하는 웹/모바일 기반 도서 추천, 열람, 링크 연동 등 일체의 기능</li>
        <li>“이용자”: 본 약관에 동의하고 서비스를 이용하는 자</li>
        <li>“콘텐츠”: 텍스트, 이미지, 메타데이터 등 서비스 내 제공되는 자료</li>
      </ul>

      <h2>3. 약관의 효력 및 변경</h2>
      <p>회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 변경 시 사전 공지합니다. 이용자가 변경 이후에도 서비스를 계속 이용하면 변경에 동의한 것으로 봅니다.</p>

      <h2>4. 계정 및 이용</h2>
      <ul>
        <li>이용자는 타인의 권리를 침해하거나 법령을 위반하는 행위를 해서는 안 됩니다.</li>
        <li>서비스 내 제공되는 미리보기/링크 기능은 각 권리자의 정책을 따릅니다.</li>
      </ul>

      <h2>5. 유료서비스 및 결제</h2>
      <p>유료 기능을 제공하는 경우 가격, 결제·환불·취소 조건을 별도로 고지하며 해당 고지가 본 약관을 우선합니다.</p>

      <h2>6. 콘텐츠 및 지적재산권</h2>
      <p>서비스 및 제공 콘텐츠에 대한 권리는 회사 또는 권리자에게 있으며, 무단 복제·배포를 금지합니다.</p>

      <h2>7. 서비스의 변경 및 중단</h2>
      <p>회사는 운영상·기술상의 필요에 따라 서비스 내용을 변경하거나 중단할 수 있으며, 중요한 변경은 사전 공지합니다.</p>

      <h2>8. 면책</h2>
      <p>불가항력, 제3자 서비스 장애, 이용자 귀책 사유로 인한 손해에 대하여 회사는 책임을 지지 않습니다.</p>

      <h2>9. 분쟁 해결</h2>
      <p>분쟁 발생 시 관련 법령 및 관할 법원을 따릅니다. 대한민국 법을 준거법으로 합니다.</p>

      <h2>10. 테스트</h2>
      <p>테스트 텍스트 입니다. 3번째 CICD 테스트</p>
    </section>
  </main>
</template>
