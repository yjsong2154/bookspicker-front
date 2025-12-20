import api from './index'
import type { Book } from '@/types/book'

export interface BookDetailResponse {
  message: string
  book: Book & {
    isbn: string
    is_liked?: boolean
    is_wished?: boolean
    comments?: any[]
    // Snake_case fields from API
    cover_url?: string
    description?: string
    buy_url?: string
    // Add other fields as needed
  }
}

export interface ToggleLikeResponse {
  message: string
  is_liked: boolean
  like_count: number
}

export interface ToggleWishlistResponse {
  message: string
  is_wished: boolean
}

export interface AddCommentRequest {
  content: string
  tags?: {
    existing_tag_ids?: number[]
    new_tag_names?: string[]
  }
}

export const bookApi = {
  getBookDetail: (isbn: string) => api.get<BookDetailResponse>(`/api/books/${isbn}/`),
  toggleLike: (isbn: string) => api.post<ToggleLikeResponse>(`/api/books/${isbn}/likes/`),
  toggleWishlist: (isbn: string) => api.post<ToggleWishlistResponse>(`/api/books/${isbn}/wishlist/`),
  addComment: (isbn: string, data: AddCommentRequest) => api.post(`/api/books/${isbn}/comment/`, data),
  addToLibrary: (isbn: string) => api.post(`/api/books/${isbn}/library/`),
}
