export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  summary?: string
  buyUrl?: string
  canReadInline?: boolean
  genres?: string[]
}
