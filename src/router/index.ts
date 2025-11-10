import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    // 상세는 화면은 유지하고 모달로 오버레이
    {
      path: '/book/:id',
      name: 'book-detail',
      component: () => import('@/views/HomeView.vue'),
      props: true,
    },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ],
})
export default router
