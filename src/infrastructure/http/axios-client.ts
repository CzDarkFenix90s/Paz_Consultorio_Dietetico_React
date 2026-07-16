// src/infrastructure/http/axios-client.ts
import axios from 'axios'
import { API_CONFIG } from '../config/api.config'
import { localTokenStorage } from '../storage/local-token-storage'

export const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor to inject JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localTokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor to handle session expiration (401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the server returns a 401 and it's not the login path
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/login/')) {
      localTokenStorage.clear()
      // If window is defined (browser), redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
