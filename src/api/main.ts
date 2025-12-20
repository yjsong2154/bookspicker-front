import api from './index'
import type { Book } from '@/types/book'

export interface CurrentReadingResponse {
  message: string
  current_reading_book: {
    book: Book
    last_read_at: string
  }
}

export const mainApi = {
  getCurrentReading: () => api.get<CurrentReadingResponse>('/api/main/current-reading/'),
}
