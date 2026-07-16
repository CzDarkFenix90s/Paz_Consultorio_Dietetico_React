const rawUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'
const cleanUrl = typeof rawUrl === 'string' ? rawUrl.replace(/^['"]|['"]$/g, '') : rawUrl

const isProd = import.meta.env.PROD

export const API_CONFIG = {
  BASE_URL: isProd ? '/api' : cleanUrl,
  TIMEOUT: 10_000,
} as const
