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

export const accountApi = {
  // Coldstart
  setNickname: (data: SetNicknameRequest) => api.post('/accounts/coldstart/nickname/', data),
  setPreferredTags: (data: SetPreferredTagsRequest) => api.post('/accounts/coldstart/tags/', data),
  setPreferredBooks: (data: SetPreferredBooksRequest) => api.post('/accounts/coldstart/books/', data),

  // Profile
  updateNickname: (data: { nickname: string }) => api.patch('/accounts/nickname/', data),
  resign: (data: { confirm: boolean; refresh: string }) => api.post('/accounts/resign/', data),
}
