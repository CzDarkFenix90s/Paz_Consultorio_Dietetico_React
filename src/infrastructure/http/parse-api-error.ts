// src/infrastructure/http/parse-api-error.ts
import { isAxiosError } from 'axios'

export function parseApiError(error: unknown): string {
  if (!isAxiosError(error)) {
    if (error instanceof Error) return error.message
    return 'Ha ocurrido un error inesperado.'
  }

  if (error.response) {
    const data = error.response.data
    // Handle Django error responses which can be dict, array or string
    if (typeof data === 'object' && data !== null) {
      // Look for error, detail, non_field_errors
      if ('error' in data) return String((data as any).error)
      if ('detail' in data) return String((data as any).detail)
      if ('non_field_errors' in data) {
        const errs = (data as any).non_field_errors
        return Array.isArray(errs) ? errs.join(' ') : String(errs)
      }
      
      // Concat field validation errors
      const messages: string[] = []
      for (const [key, value] of Object.entries(data)) {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
        if (Array.isArray(value)) {
          messages.push(`${fieldName}: ${value.join(', ')}`)
        } else if (typeof value === 'object' && value !== null) {
          messages.push(`${fieldName}: ${JSON.stringify(value)}`)
        } else {
          messages.push(`${fieldName}: ${value}`)
        }
      }
      if (messages.length > 0) return messages.join('\n')
    }

    if (typeof data === 'string') return data
    return `Error del servidor (${error.response.status}).`
  }

  if (error.request) {
    return 'No se pudo conectar con el servidor. Por favor, asegúrate de que el backend de Django esté encendido.'
  }

  return error.message
}
