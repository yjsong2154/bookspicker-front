import axios from 'axios'
import type { AxiosInstance } from 'axios'

// Create a separate instance for the Analysis Server
const analysisApiInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8001', // Assuming 8001 based on plan
  timeout: 60000, // 60s timeout for large file analysis
  headers: {
    // 'Content-Type': 'multipart/form-data' is set automatically by axios when passing FormData
  },
})

// Logging Interceptors for Analysis Server
analysisApiInstance.interceptors.request.use(
  (config) => {
    console.group(`[Analysis API Request] ${config.method?.toUpperCase()} ${config.url}`)
    console.log('Params:', config.params)
    console.log('Data:', config.data)
    console.groupEnd()
    return config
  },
  (error) => {
    console.error('[Analysis API Request Error]', error)
    return Promise.reject(error)
  }
)

analysisApiInstance.interceptors.response.use(
  (response) => {
    console.group(`[Analysis API Response] ${response.status} ${response.config.url}`)
    console.log('Data:', response.data)
    console.groupEnd()
    return response
  },
  (error) => {
    console.group(`[Analysis API Error] ${error.config?.url}`)
    console.error('Status:', error.response?.status)
    console.error('Message:', error.message)
    console.error('Data:', error.response?.data)
    console.groupEnd()
    return Promise.reject(error)
  }
)

export interface AnalysisResponse {
  tags: { [category: string]: { [tag: string]: number } }
  vector: number[]
}

export interface AnalysisSaveRequest {
  isbn: string
  title: string
  author: string
  description: string
  publication_year: string
  vector: number[]
  tags: string[]
}

export const analysisApi = {
  analyzeEpub: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return analysisApiInstance.post<AnalysisResponse>('/analysis/analyze', formData, {
      timeout: 300000 // 5 minutes
    })
  },
  saveAnalysisData: (data: AnalysisSaveRequest) => {
    return analysisApiInstance.post('/books', data) // Changed URL to match router prefix /books (assuming previously it was /analysis/books which might be wrong or via different router? Wait, prior call was /analysis/books. But main.py includes books.router. books.router prefix is /books. So it should be /books ???
    // Wait, the user code was calling /analysis/books. If that worked, then main.py must include books router with /analysis prefix or something?
    // main.py: app.include_router(books.router) -> prefix /books.
    // So /books.
    // So the previous code was probably failing 404 if it wasn't tested? Or maybe proxy rewrite?
    // Let's assume standard /books prefix.
    // But to be safe, I'll use /books for the new one.
    return analysisApiInstance.post('/books', data)
  },
  saveAnalysisDataWithCover: (formData: FormData) => {
    return analysisApiInstance.post('/books/with-cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getAdvancedRecommendations: (userId: number) => {
    return analysisApiInstance.get<RecommendationResponse>(`/users/${userId}/advanced-recommendations`)
  },
  recordReadHistory: (userId: number, isbn: string) => {
    return analysisApiInstance.post(`/users/${userId}/books/isbn/${isbn}`)
  },
  removeReadHistory: (userId: number, isbn: string) => {
    return analysisApiInstance.delete(`/users/${userId}/books/isbn/${isbn}`)
  },
  getWordCloud: (userId: number) => {
    return analysisApiInstance.get<AnalysisWordCloudItem[]>(`/users/${userId}/wordcloud`)
  }
}

export interface AnalysisWordCloudItem {
  text: string
  value: number
}

export interface RecommendationBook {
  isbn: string
  title: string
  author: string
  cover_image: string
  description: string
  published_year: number
  tags: Record<string, number>
}

export interface RecommendationSection {
  title: string
  books: RecommendationBook[]
}

export interface RecommendationResponse {
  sections: RecommendationSection[]
}
