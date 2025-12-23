import api from './index'

export interface SetNicknameRequest {
  nickname: string
}

export interface SetPreferredTagsRequest {
  tag_ids: number[]
}

export interface SetPreferredBooksRequest {
  isbn_list: string[]
}

export interface SetProfileInfoRequest {
  profile_info: {
    birth_year?: number;
    sex?: string;
    books_per_month?: number;
  }
}

export const accountApi = {
  // Coldstart
  getMe: () => api.get('/accounts/me/'),
  getColdstartTags: () => api.get('/accounts/coldstart/tags/'),
  getColdstartBooks: () => api.get('/accounts/coldstart/books/'),

  setNickname: (data: SetNicknameRequest) => api.post('/accounts/coldstart/nickname/', data),
  setPreferredTags: (data: SetPreferredTagsRequest) => api.post('/accounts/coldstart/tags/', data),
  setPreferredBooks: (data: SetPreferredBooksRequest) => api.post('/accounts/coldstart/books/', data),
  setProfileInfo: (data: SetProfileInfoRequest) => api.post('/accounts/coldstart/profile_info/', data),

  // Profile
  updateNickname: (data: { nickname: string }) => api.patch('/accounts/nickname/', data),
  resign: (data: { confirm: boolean; refresh: string }) => api.post('/accounts/resign/', data),
  getBookList: (filter: 'library' | 'liked' | 'wishlist' | 'recent', limit = 20, offset = 0) =>
    api.get(`/accounts/booklist/`, { params: { filter, limit, offset } }),
  getComments: (params?: { limit?: number; offset?: number; status?: string; isbn?: string }) =>
    api.get('/accounts/comments/', { params }),
}
