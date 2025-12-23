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
    return analysisApiInstance.post('/analysis/books', data)
  }
}
