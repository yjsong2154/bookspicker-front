import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guestOnly: true } },

    // 보호 라우트들
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
    { path: '/book/:id', name: 'book-detail', component: () => import('@/views/HomeView.vue'), props: true,},
    { path: '/best-seller', name: 'best-seller', component: () => import('@/views/BestSellerView.vue'), meta: { requiresAuth: true } },
    { path: '/wishlist', name: 'wishlist', component: () => import('@/views/WishlistView.vue'), meta: { requiresAuth: true } },
    { path: '/library', name: 'library', component: () => import('@/views/LibraryView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } },

    // 공개 페이지(약관/개인정보)
    { path: '/terms', name: 'terms', component: () => import('@/views/TermsView.vue') },
    { path: '/privacy', name: 'privacy', component: () => import('@/views/PrivacyView.vue') },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') }
  ]
})

// 전역 가드
router.beforeEach((to) => {
  const auth = useAuthStore()
  // 새로고침 후에도 상태 복구
  if (auth.token === null && auth.user === null) auth.loadFromStorage()

  // 이미 로그인인데 /login으로 가면 홈으로
  if (to.meta.guestOnly && auth.isAuthed) return { name: 'home' }

  // 보호 라우트 접근 시
  if (to.meta.requiresAuth && !auth.isAuthed) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
