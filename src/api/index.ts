import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Auth Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Error Handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: any) => {
    // TODO: Handle 401 Unauthorized (Token Refresh logic) if needed later
    return Promise.reject(error)
  }
)

export default api
