export interface Book {
  id: string
  isbn: string
  title: string
  author: string
  coverUrl: string
  summary?: string
  buyUrl?: string
  canReadInline?: boolean
  genres?: string[]
  likeCount?: number
  isWished?: boolean
}
