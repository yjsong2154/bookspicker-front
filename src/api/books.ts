import api from './index'
import type { Book } from '@/types/book'


export interface BookComment {
  comment_id: number
  content: string
  created_at: string
  user?: {
    id: number
    nickname: string
  }
}

export interface BookDetailResponse {
  message: string
  book: {
    isbn: string
    title: string
    cover_image: string
    description: string
    genre_path: string
    is_liked: boolean
    is_wished: boolean
    like_count: number
    published_date: string
    publisher: string
    why_picked: {
      body: string
    }
    authors: {
      name: string
      bio: string
      role: string
      detail_url: string
    }[]
    action_urls: {
      purchase_url?: string
      read_now_url?: string
    }
    comments: BookComment[]
    book_tags: string[]
    epub_url?: string
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
  user_id: number
  content: string
  tags?: {
    existing_tag_ids?: number[]
    new_tag_names?: string[]
  }
}

export interface PopularBook {
  isbn: string
  title: string
  publisher: string
  cover_image: string
  abstract_descript: string
  top_tags: string[]
  is_liked: boolean
  like_count: number
  is_wished: boolean
}

export interface Genre {
  id: number
  name: string
  parent: string
}

export const bookApi = {
  getGenreList: () => api.get<Genre[]>('/api/admin/genres/'),
  getBookDetail: (isbn: string) => api.get<BookDetailResponse>(`/api/books/${isbn}/`),
  toggleLike: (isbn: string) => api.post<ToggleLikeResponse>(`/api/books/${isbn}/likes/`),
  toggleWishlist: (isbn: string) => api.post<ToggleWishlistResponse>(`/api/books/${isbn}/wishlist/`),
  addComment: (isbn: string, data: AddCommentRequest) => api.post(`/api/books/${isbn}/comment/`, data),
  addToLibrary: (isbn: string) => api.post(`/api/books/${isbn}/library/`),
  deleteFromLibrary: (isbn: string) => api.delete(`/api/books/${isbn}/library/`),
  getPopularBooks: (period: 'monthly' | 'weekly' | 'steady' = 'monthly') => api.get<{ message: string; items: PopularBook[] }>(`/api/books/popular/?q=${period}`),
  searchBooks: (query: string) => api.get<{ message: string; books: Book[] }>(`/api/books/search/`, { params: { q: query } }),
  updateComment: (isbn: string, commentId: number, data: { content: string }) => api.put<BookComment>(`/api/books/${isbn}/comment/${commentId}/edit/`, data),
  deleteComment: (isbn: string, commentId: number) => api.delete<{ detail: string }>(`/api/books/${isbn}/comment/${commentId}/delete/`),
}
