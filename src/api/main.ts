import api from './index'
import type { Book } from '@/types/book'

export interface CurrentReadingResponse {
  message: string
  current_reading_book: {
    book: Book
    last_read_at: string
    progress?: number
  }
}

export interface Banner {
  banner_id: number
  button: {
    label: string
    url: string
  }
  description: string
  key_visual_image: string
  order: number
  title: string
}

export interface BannerResponse {
  message: string
  banners: Banner[]
}

export const mainApi = {
  getCurrentReading: () => api.get<CurrentReadingResponse>('/api/main/current-reading/'),
  getBanner: () => api.get<BannerResponse>('/api/main/banner/'),
}
