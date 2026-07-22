// src/presentation/pages/auth/RegisterPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { axiosClient } from '../../../infrastructure/http/axios-client'
import AuthShell from './AuthShell'

// Helper function to calculate SHA-256 hash using native Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading: authLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  })
  
  // Verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [serverHash, setServerHash] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError()
    setValidationError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Submit handler: Triggers the verification code email
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { username, email, password, password2 } = formData

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

    try {
      setSendingCode(true)
      setValidationError('')
      clearError()
      
      // Request verification code to email via Django backend
      const response = await axiosClient.post('/auth/send-code/', { 
        email: email.trim() 
      })
      
      setServerHash(response.data.hash)
      setSendingCode(false)
      setShowVerificationModal(true)
    } catch (err: any) {
      setSendingCode(false)
      const apiMsg = err.response?.data?.error || err.response?.data?.detail
      setValidationError(apiMsg || 'No se pudo enviar el código de verificación. Revisa la conexión o el correo.')
    }
  }

  // Verification modal confirmation handler
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerificationError('')
    
    if (verificationCode.length !== 6) {
      setVerificationError('Introduce el código de 6 dígitos completo.')
      return
    }

    const clientHash = await sha256(verificationCode.trim())
    
    if (clientHash !== serverHash) {
      setVerificationError('El código ingresado es incorrecto. Revisa tu bandeja de entrada o spam.')
      return
    }

    // Code verified! Proceed with registration
    setShowVerificationModal(false)
    const { username, email, password, password2, first_name, last_name } = formData
    
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
    <>
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
            disabled={sendingCode || authLoading}
            className="mt-4 w-full flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {sendingCode || authLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>
      </AuthShell>

      {/* Retro CRT Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono crt-scanlines">
          <div className="w-full max-w-md rounded-3xl bg-[#384349] border-4 border-[#242d32] p-6 sm:p-8 text-center space-y-6 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">[SEGURIDAD SYNC DECK]</span>
              <h2 className="text-xl font-black uppercase text-white tracking-widest">Confirmación de Cuenta</h2>
              <p className="text-xs text-slate-300 leading-relaxed uppercase font-bold mt-2">
                Ingresa el código de 6 dígitos enviado a:<br />
                <span className="text-cyan-400">{formData.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                required
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-center text-2xl font-black tracking-[0.4em] text-cyan-400 outline-none focus:border-cyan-400 transition"
              />

              {verificationError && (
                <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 uppercase tracking-wide">
                  {verificationError}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-white/10 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#ff5500] hover:bg-[#e04b00] border border-orange-400 py-3 text-xs font-black uppercase tracking-wider text-white transition shadow-md shadow-orange-500/10 btn-pixel-retro"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}