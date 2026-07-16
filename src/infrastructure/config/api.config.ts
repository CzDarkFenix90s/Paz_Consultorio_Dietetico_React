const rawUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'
const cleanUrl = typeof rawUrl === 'string' ? rawUrl.replace(/^['"]|['"]$/g, '') : rawUrl

export const API_CONFIG = {
  BASE_URL: cleanUrl,
  TIMEOUT: 10_000,
} as const
