import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    // 책 id 배열로 관리
    ids: [] as string[],
  }),
  getters: {
    has: (s) => (id: string) => s.ids.includes(id),
  },
  actions: {
    add(id: string) {
      if (!this.ids.includes(id)) this.ids.unshift(id)
      this.persist()
    },
    remove(id: string) {
      this.ids = this.ids.filter(x => x !== id)
      this.persist()
    },
    toggle(id: string) {
      this.has(id) ? this.remove(id) : this.add(id)
    },
    // 간단한 로컬스토리지 영속화
    load() {
      try {
        const raw = localStorage.getItem('wishlist_v1')
        if (raw) this.ids = JSON.parse(raw)
      } catch {}
    },
    persist() {
      localStorage.setItem('wishlist_v1', JSON.stringify(this.ids))
    }
  }
})
