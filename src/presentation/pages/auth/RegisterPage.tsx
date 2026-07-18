// src/presentation/pages/auth/RegisterPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import AuthShell from './AuthShell'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  })
  const [validationError, setValidationError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError()
    setValidationError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { username, email, password, password2, first_name, last_name } = formData

    if (!username.trim() || !email.trim() || !password || !password2) {
      setValidationError('Por favor llena todos los campos obligatorios.')
      return
    }

    if (password !== password2) {
      setValidationError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    const success = await register({
      username: username.trim().toLowerCase(),
      email: email.trim(),
      password,
      password2,
      first_name,
      last_name,
    })

    if (success) {
      navigate('/patient/menu')
    }
  }

  return (
    <AuthShell
      eyebrow="Registro de Paciente"
      title="Crea tu cuenta y empieza a cuidar tu nutrición"
      description="Únete a nuestra plataforma inteligente para recibir planes de alimentación, rutinas y chat directo con tu especialista."
      footerPrompt="¿Ya tienes una cuenta?"
      footerLinkLabel="Inicia sesión"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Nombre</span>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Ana"
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/50"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Apellido</span>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Gómez"
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/50"
            />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Nombre de Usuario *</span>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            placeholder="anagomez"
            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/50"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Correo electrónico *</span>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/50"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Contraseña *</span>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/50"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Confirmar contraseña *</span>
            <input
              type="password"
              name="password2"
              required
              value={formData.password2}
              onChange={handleInputChange}
              placeholder="Repite la contraseña"
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/50"
            />
          </label>
        </div>

        {(validationError || error) ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 whitespace-pre-line">
            {validationError || error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>
    </AuthShell>
  )
}