import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Book } from '@/types/book'

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
    // 데모: 목록에서 찾아 캐싱 (실서비스에선 /book/:id API 호출)
    if (!list.value.length) await loadList()
    const found = list.value.find(b => b.id === id)
    if (found) {
      detail.value.set(id, found)
      return found
    }
    throw new Error('Not found')
  }

  return { list, detail, loading, error, loadList, loadById }
})
