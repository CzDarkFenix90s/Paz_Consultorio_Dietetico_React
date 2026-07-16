// src/infrastructure/storage/local-token-storage.ts

const ACCESS_TOKEN_KEY = 'dietetic_access_token'
const REFRESH_TOKEN_KEY = 'dietetic_refresh_token'
const USER_INFO_KEY = 'dietetic_user_info'

export const localTokenStorage = {
  saveTokens(access: string, refresh: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
  },

  saveUser(user: any) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user))
  },

  getUser(): any | null {
    const raw = localStorage.getItem(USER_INFO_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
}
