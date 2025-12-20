import api from './index'

export interface ViewerMetaResponse {
  message: string
  bookview: {
    viewer: {
      initial_location: number
      progress_percent: number
    }
  }
}

export interface BookContentResponse {
  message: string
  content: {
    text: string
    has_more: boolean
    next_from: number
  }
}

export const viewerApi = {
  getViewerMeta: (isbn: string) => api.get<ViewerMetaResponse>(`/api/bookviews/${isbn}/`),
  getBookContent: (isbn: string, params: { from?: number; limit?: number } = {}) =>
    api.get<BookContentResponse>(`/api/bookviews/${isbn}/content/`, { params }),
}
