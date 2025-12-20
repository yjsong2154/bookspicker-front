import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Book } from '@/types/book'
import { bookApi } from '@/api/books'

export const useBookStore = defineStore('book', () => {
  const list = ref<Book[]>([])
  const detail = ref<Map<string, Book>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadList() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/mock/books.json')
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as Book[]
      list.value = data
    } catch (e: any) {
      error.value = e?.message ?? 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function loadById(id: string) {
    if (detail.value.has(id)) return detail.value.get(id)!

    // API 호출로 변경
    try {
      const { data } = await bookApi.getBookDetail(id)
      const bookData = data.book
      // 변환: API의 isbn -> id, description -> summary
      const book: Book = {
        ...bookData,
        id: bookData.isbn,
        title: bookData.title,
        author: bookData.author || 'Unknown', // API에 author가 있는지 확인 필요
        coverUrl: bookData.cover_url || '', // API 필드 확인 필요
        summary: bookData.description || '',
        buyUrl: bookData.buy_url,
        canReadInline: false, // API에서 제공하는지 확인 필요
        genres: [], // API에서 제공하는지 확인 필요
      }
      detail.value.set(id, book)
      return book
    } catch (e) {
      throw new Error('Failed to load book detail')
    }
  }

  return { list, detail, loading, error, loadList, loadById }
})
