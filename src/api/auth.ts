import api from './index'

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  refresh?: string
  access?: string
}

export interface RefreshRequest {
  refresh: string
}

export const authApi = {
  login: (data: LoginRequest) => api.post<TokenResponse>('/api/token/', data),
  refreshToken: (data: RefreshRequest) => api.post<{ access: string }>('/api/token/refresh/', data),
}
