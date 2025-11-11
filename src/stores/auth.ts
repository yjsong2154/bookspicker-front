import { defineStore } from 'pinia'

type User = { id: string; email: string; name: string }
type AuthState = {
  token: string | null
  user: User | null
}

const STORAGE_KEY = 'auth_v1'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ token: null, user: null }),
  getters: {
    isAuthed: (s) => !!s.token && !!s.user,
  },
  actions: {
    loadFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const { token, user } = JSON.parse(raw)
        this.token = token ?? null
        this.user  = user  ?? null
      } catch {}
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        token: this.token, user: this.user
      }))
    },
    async login(email: string, password: string) {
      // TODO: 실제 API로 교체 (아래는 데모용)
      await new Promise(r => setTimeout(r, 400))
      // 매우 단순한 예시 검증
      if (!email || !password) throw new Error('이메일/비밀번호를 입력하세요.')
      this.token = 'fake-jwt-token'
      this.user = { id: 'u1', email, name: email.split('@')[0] ?? '' }
      this.persist()
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    },
  }
})
