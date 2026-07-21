import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  text: string
  type: ToastType
}

interface ToastContextType {
  showToast: (text: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((text: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, text, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'success'
                ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10'
                : toast.type === 'error'
                ? 'bg-slate-900/90 border-rose-500/40 text-rose-300 shadow-rose-500/10'
                : 'bg-slate-900/90 border-sky-500/40 text-sky-300 shadow-sky-500/10'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-sky-400 shrink-0" />}
              <span className="text-xs font-semibold leading-relaxed break-words">{toast.text}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white shrink-0 p-1 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    // Fallback if not inside ToastProvider
    return {
      showToast: (text: string) => console.log('Toast:', text)
    }
  }
  return context
}
