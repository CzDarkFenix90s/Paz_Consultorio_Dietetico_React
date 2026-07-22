// src/presentation/pages/auth/LoginPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, ShieldPlus, User, Terminal } from 'lucide-react'
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
    <main className="fixed inset-0 z-[10000] bg-[#070b10] p-3 flex items-center justify-center font-mono selection:bg-orange-500 selection:text-white overflow-hidden">
      
      {/* Light Off-White / Silver Retro Television Chassis Frame (Matching Start Screen) */}
      <div className="relative w-full max-w-2xl p-3 sm:p-6 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#e1e6ea] border-4 sm:border-8 border-[#d4dbdf] shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex items-center justify-center crt-scanlines">
        
        {/* Top-Left Yellow AWS SITE OF THE DAY Ribbon Badge */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#facc15] text-slate-950 px-3 py-1 font-mono text-[9px] sm:text-[10px] font-black tracking-tight shadow-md uppercase transform -rotate-12 border border-amber-500 z-40 pointer-events-none">
          AWS SITE OF THE DAY
        </div>

        {/* Right Red Ribbon Badge */}
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 bg-red-600 text-white px-1.5 py-4 font-mono text-[8px] font-bold tracking-widest uppercase [writing-mode:vertical-rl] rounded-l z-40 shadow-md pointer-events-none">
          Site of the Day
        </div>

        {/* Inner Dark Slate Grey CRT Terminal Glass Screen */}
        <div className="relative w-full rounded-[1.8rem] sm:rounded-[2.8rem] bg-[#384349] text-slate-100 border-4 sm:border-8 border-[#242d32] shadow-[inset_0_0_90px_rgba(0,0,0,0.85)] p-5 sm:p-8 flex flex-col justify-between overflow-hidden">
          
          {/* Animated VHS Tape Horizontal Tracking Line Glitch */}
          <div className="vhs-tracking-line" />

          {/* Top Info Deck Bar */}
          <div className="relative z-20 flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-200 tracking-[0.2em] uppercase border-b border-slate-400/20 pb-3">
            <span className="flex items-center gap-2 text-slate-100 vhs-text-glitch">
              <Terminal className="h-4 w-4 text-slate-300" /> &gt;_ [NUTRITEC LOGIN BOOT]
            </span>
            <span className="text-emerald-400 font-extrabold vhs-text-glitch">SECURE DECK</span>
          </div>

          {/* Form Content */}
          <div className="relative z-20 flex flex-col items-center mt-6 text-center">
            
            {/* Animated Cyan Shield Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] vhs-text-glitch">
              <ShieldPlus className="h-8 w-8 animate-pulse" />
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-widest text-slate-100 uppercase vhs-text-glitch" style={{ filter: 'drop-shadow(0 0 8px #38bdf8)' }}>
              DIETETIC APP
            </h1>
            <p className="mt-1.5 text-xs text-slate-300 font-bold uppercase tracking-wider">
              [SISTEMA DE CONTROL NUTRICIONAL]
            </p>

            <form className="mt-6 w-full space-y-4 text-left" onSubmit={handleSubmit}>
              <label className="block space-y-1">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Nombre de Usuario</span>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#242d32] px-4 py-3 text-slate-100 shadow-inner focus-within:border-cyan-400/50 transition">
                  <User className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Usuario"
                    value={username}
                    onChange={(event) => {
                      clearError()
                      setUsername(event.target.value)
                    }}
                    className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-500 uppercase tracking-wider"
                  />
                </div>
              </label>

              <label className="block space-y-1">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Contraseña de Acceso</span>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#242d32] px-4 py-3 text-slate-100 shadow-inner focus-within:border-cyan-400/50 transition">
                  <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Contraseña"
                    value={password}
                    onChange={(event) => {
                      clearError()
                      setPassword(event.target.value)
                    }}
                    className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white transition shrink-0"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error ? (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[11px] font-bold text-red-400 whitespace-pre-line uppercase tracking-wide">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-xl bg-[#ff5500] hover:bg-[#e04b00] px-4 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-md transition border border-orange-400 btn-pixel-retro active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'INICIAR SESIÓN'
                )}
              </button>
            </form>

            <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ¿Eres nuevo?{' '}
              <Link to="/register" className="text-cyan-400 hover:underline transition decoration-2 underline-offset-2">
                Crea una cuenta aquí
              </Link>
            </p>
          </div>

          {/* Bottom Deck Info Bar */}
          <div className="relative z-20 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-300 tracking-[0.2em] uppercase border-t border-slate-400/20 pt-3 mt-6">
            <span className="vhs-text-glitch">{"[STATUS: READY FOR TERMINAL SYNC]"}</span>
            <span className="hidden sm:block text-slate-200 font-bold">{"[AUTO TRACKING -- OK]"}</span>
          </div>

        </div>

      </div>
    </main>
  )
}