import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Auth Token & Logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Auth Token Logic
    const raw = localStorage.getItem('auth_v1')
    if (raw && config.headers) {
      try {
        const parsed = JSON.parse(raw)
        const token = parsed.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (e) {
        console.error('Failed to parse auth token from storage', e)
      }
    }

    // Logging
    console.group(`[Main API Request] ${config.method?.toUpperCase()} ${config.url}`)
    console.log('Params:', config.params)
    console.log('Data:', config.data)
    console.groupEnd()

    return config
  },
  (error: AxiosError) => {
    console.error('[Main API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response Interceptor: Error Handling & Logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.group(`[Main API Response] ${response.status} ${response.config.url}`)
    console.log('Data:', response.data)
    console.groupEnd()
    return response
  },
  async (error: AxiosError) => {
    console.group(`[Main API Error] ${error.config?.url}`)
    console.error('Status:', error.response?.status)
    console.error('Message:', error.message)
    console.error('Data:', error.response?.data)
    console.groupEnd()

    // TODO: Handle 401 Unauthorized (Token Refresh logic) if needed later
    return Promise.reject(error)
  }
)

export default api
