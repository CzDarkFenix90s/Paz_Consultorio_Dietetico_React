// src/presentation/pages/auth/LoginPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, ShieldPlus, User } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!username.trim() || !password) {
      return
    }

    const success = await login({
      username: username.trim(),
      password,
    })

    if (success) {
      // Profile loaded. Check role to redirect.
      const state = useAuthStore.getState()
      const role = state.user?.role
      if (role === 'admin' || role === 'nutricionista') {
        navigate('/admin')
      } else {
        navigate('/patient/menu')
      }
    }
  }



  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#1b4332_0%,#2d6a4f_50%,#40916c_100%)] px-4 py-6 text-white sm:px-6 lg:px-8 flex items-center justify-center">
      <section className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md sm:p-10">
        <div className="mx-auto flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20">
            <ShieldPlus className="h-10 w-10 animate-pulse" strokeWidth={2.5} />
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Dietetic App
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-300">Bienvenido a tu salud inteligente</p>

          <form className="mt-10 w-full space-y-5 text-left" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Nombre de Usuario</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-slate-100 shadow-inner focus-within:border-emerald-500/50 transition">
                <User className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Nombre de Usuario"
                  value={username}
                  onChange={(event) => {
                    clearError()
                    setUsername(event.target.value)
                  }}
                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-slate-500"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Contraseña de Acceso</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-slate-100 shadow-inner focus-within:border-emerald-500/50 transition">
                <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Contraseña de Acceso"
                  value={password}
                  onChange={(event) => {
                    clearError()
                    setPassword(event.target.value)
                  }}
                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition shrink-0"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>

            {error ? (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 whitespace-pre-line">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-4 text-base font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-emerald-500/25 transition duration-350 hover:bg-emerald-400 hover:shadow-emerald-500/45 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <p className="mt-8 text-sm font-medium text-slate-400">
            ¿Eres nuevo?{' '}
            <Link to="/register" className="text-emerald-400 font-bold hover:underline transition decoration-2 underline-offset-4">
              Crea una cuenta aquí
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}