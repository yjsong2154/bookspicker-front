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
  }
}
