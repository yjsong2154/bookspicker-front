import { defineStore } from 'pinia'
import axios from 'axios'

type User = { id: string; email: string; nickname?: string; name: string }
type AuthState = {
  token: string | null
  refreshToken: string | null
  user: User | null
}

const STORAGE_KEY = 'auth_v1'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    user: null
  }),
  getters: {
    isAuthed: (s) => !!s.token && !!s.user,
  },
  actions: {
    loadFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const { token, refreshToken, user } = JSON.parse(raw)
        this.token = token ?? null
        this.refreshToken = refreshToken ?? null
        this.user = user ?? null
      } catch { }
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        token: this.token,
        refreshToken: this.refreshToken,
        user: this.user
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
    async loginWithGoogle(code: string) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/accounts/social-login/', { code })
        const { token, user } = res.data
        console.log('🔥 Login Success!')
        console.log('User:', user)
        console.log('Access Token:', token.access)
        console.log('Refresh Token:', token.refresh)
        this.token = token.access
        this.refreshToken = token.refresh
        this.user = user
        this.persist()
        return true
      } catch (err: unknown) {
        console.error('Google Login Error', err)
        let msg = '구글 로그인 실패'
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          msg = err.response.data.message
        }
        throw new Error(msg)
      }
    },
    logout() {
      this.token = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    },
    async resign(api: any) {
      if (!this.refreshToken) throw new Error('Refresh token missing')
      await api.resign({ confirm: true, refresh: this.refreshToken })
      this.logout()
    }
  }
})
