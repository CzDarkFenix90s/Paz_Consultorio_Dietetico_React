// src/App.tsx
import AppRouter from './presentation/router/AppRouter'
import { ToastProvider } from './presentation/components/Toast'

export default function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  )
}
