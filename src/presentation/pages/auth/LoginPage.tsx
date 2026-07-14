import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeOff, Lock, ShieldPlus, User } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (username.trim().toLowerCase() === 'john' && password === '12345678') {
      setErrorMessage('')
      navigate('/patient/menu')
      return
    }

    setErrorMessage('Usuario o contraseña incorrectos. Prueba con john / 12345678.')
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#3c9b42_0%,#5ca95a_18%,#5aa45c_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6 lg:p-8">
        <div className="w-full rounded-[1.75rem] border border-white/15 bg-white/10 p-6 sm:p-8 lg:p-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-lg shadow-black/10">
              <ShieldPlus className="h-10 w-10" strokeWidth={2.5} />
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">Dietetic App</h1>
            <p className="mt-3 text-lg font-medium text-white/75">Bienvenido a tu salud inteligente</p>

            <form className="mt-10 w-full space-y-5 text-left" onSubmit={handleSubmit}>
              <label className="block">
                <span className="sr-only">Nombre de Usuario</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 px-4 py-4 text-white/85 shadow-inner shadow-white/5">
                  <User className="h-5 w-5 shrink-0 text-white/85" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-white/70"
                  />
                </div>
              </label>

              <label className="block">
                <span className="sr-only">Contraseña de Acceso</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 px-4 py-4 text-white/85 shadow-inner shadow-white/5">
                  <Lock className="h-5 w-5 shrink-0 text-white/85" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña de Acceso"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-white/70"
                  />
                  <EyeOff className="h-5 w-5 shrink-0 text-white/75" />
                </div>
              </label>

              {errorMessage ? (
                <p className="rounded-2xl border border-red-200/30 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-50">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-2 w-full rounded-2xl bg-sky-500 px-4 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                Iniciar sesión
              </button>
            </form>

            <div className="mt-8 w-full">
              <p className="text-center text-sm font-semibold text-white/80">O entrar como (Prueba):</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  Admin
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  Nutri
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('john')
                    setPassword('12345678')
                  }}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  Paciente
                </button>
              </div>
            </div>

            <p className="mt-10 text-sm font-medium text-white/85">
              ¿Eres nuevo?{' '}
              <a href="/register" className="underline decoration-2 underline-offset-4 transition hover:text-white">
                Crea una cuenta aquí
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}