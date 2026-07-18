// src/presentation/pages/patient/PatientMenuPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  Bell, 
  CalendarCheck2, 
  ChevronRight, 
  Clock3, 
  House, 
  Menu, 
  MessageSquareText, 
  PanelLeftClose, 
  UtensilsCrossed, 
  UserCircle2,
  LogOut,
  Flame,
  ChefHat,
  Sun,
  Moon
} from 'lucide-react'

// Profile Avatar secure URL resolution helper
const getAvatarUrl = (url: string | null | undefined) => {
  if (!url || url === 'null' || url === 'None' || url.endsWith('/None') || url.endsWith('/null') || url === '/media/') return null
  
  let resolvedUrl = url.trim()
  if (resolvedUrl.includes('localhost:8000')) {
    resolvedUrl = resolvedUrl.replace('http://localhost:8000', '')
  }
  if (resolvedUrl.startsWith('http://')) {
    resolvedUrl = resolvedUrl.replace('http://', 'https://')
  }
  
  if (!resolvedUrl.startsWith('http') && !resolvedUrl.startsWith('/')) {
    if (resolvedUrl.startsWith('media/')) {
      resolvedUrl = '/' + resolvedUrl
    } else {
      resolvedUrl = '/media/' + resolvedUrl
    }
  }
  return resolvedUrl
}

const meals = [
  {
    title: 'Almuerzo: Pechuga a la plancha con quinua',
    time: '13:00 PM',
    calories: '450 kcal',
    icon: UtensilsCrossed
  },
  {
    title: 'Media Tarde: Frutos secos y manzana verde',
    time: '16:30 PM',
    calories: '180 kcal',
    icon: ChefHat
  }
]

const bottomNav = [
  { label: 'Inicio', icon: House, active: true },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
  { label: 'Recetas', icon: ChefHat, active: false },
  { label: 'Chat', icon: MessageSquareText, active: false },
]

export default function PatientMenuPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Dynamic Patient States
  const [pacienteData, setPacienteData] = useState<any | null>(null)
  const [waterLogToday, setWaterLogToday] = useState(0)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Ficha Form State
  const [fichaFormData, setFichaFormData] = useState({
    age: '',
    current_weight: '',
    height_cm: '',
    goal: '',
    dietary_restrictions: '',
    objetivo_choice: 'BAJAR_PESO',
    fecha_meta: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    sintoma_choice: 'EXCELENTE',
    sintoma_notas: ''
  })

  const [userProfileData, setUserProfileData] = useState<any | null>(null)

  // Theme state switcher
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Load theme state on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const hasDarkClass = document.documentElement.classList.contains('dark')
    if (savedTheme === 'dark' && !hasDarkClass) {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else if (savedTheme === 'light' && hasDarkClass) {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/profiles/`, { headers })
      if (response.ok) {
        const data = await response.json()
        const userProf = data.results ? data.results[0] : data[0]
        setUserProfileData(userProf)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const loadPatientProfile = async () => {
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/pacientes/?page_size=200`, { headers })
      if (response.ok) {
        const data = await response.json()
        const results = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []
        const patientObj = results.find((p: any) => p.user_id && Number(p.user_id) === Number(user?.id)) || results[0]
        if (patientObj) {
          setPacienteData(patientObj)
          setFichaFormData(prev => ({
            ...prev,
            age: patientObj.age ? patientObj.age.toString() : '',
            current_weight: patientObj.current_weight ? patientObj.current_weight.toString() : '',
            height_cm: patientObj.height_cm ? patientObj.height_cm.toString() : '',
            goal: patientObj.goal || '',
            dietary_restrictions: patientObj.dietary_restrictions || ''
          }))
          loadWaterLog(patientObj.id)
        }
      }
    } catch (error) {
      console.error('Error loading patient data:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const loadWaterLog = async (patientId: number) => {
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/registros-agua/?page_size=100`, { headers })
      if (response.ok) {
        const data = await response.json()
        const results = data.results || data
        const todayStr = new Date().toISOString().split('T')[0]
        const todayLog = (results || []).filter(
          (log: any) => (log.paciente === patientId || log.paciente_id === patientId) && log.fecha === todayStr
        )
        const totalWater = todayLog.reduce((sum: number, log: any) => sum + parseFloat(log.cantidad_ml || 0), 0)
        setWaterLogToday(totalWater)
      }
    } catch (error) {
      console.error('Error loading water log:', error)
    }
  }

  const handleAddWater = async () => {
    if (!pacienteData) return
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' }
      
      const todayStr = new Date().toISOString().split('T')[0]
      const response = await fetch(`${API_CONFIG.BASE_URL}/registros-agua/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          paciente: pacienteData.id,
          cantidad_ml: 250.0,
          fecha: todayStr
        })
      })
      if (response.ok) {
        setWaterLogToday(prev => prev + 250)
      }
    } catch (error) {
      console.error('Error logging water intake:', error)
    }
  }

  const handleSaveFicha = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pacienteData) return
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' }

      const parsedWeight = parseFloat(fichaFormData.current_weight.replace(',', '.'))
      const parsedHeight = parseFloat(fichaFormData.height_cm.replace(',', '.'))

      // 1. Update patient model (weight & height)
      const patchResponse = await fetch(`${API_CONFIG.BASE_URL}/pacientes/${pacienteData.id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          age: parseInt(fichaFormData.age) || 0,
          current_weight: parsedWeight,
          height_cm: parsedHeight,
          goal: fichaFormData.goal,
          dietary_restrictions: fichaFormData.dietary_restrictions
        })
      })

      if (!patchResponse.ok) {
        const errorData = await patchResponse.json()
        throw new Error('Error en Perfil de Paciente: ' + JSON.stringify(errorData))
      }

      // 2. Fetch and Update or Create ObjetivoPaciente
      let existingActiveGoal: any = null
      try {
        const objListRes = await fetch(`${API_CONFIG.BASE_URL}/objetivos-paciente/?page_size=100`, { headers })
        if (objListRes.ok) {
          const objListData = await objListRes.json()
          const results = objListData.results || objListData
          existingActiveGoal = (results || []).find(
            (o: any) => (o.paciente === pacienteData.id || o.paciente_id === pacienteData.id) && o.estado === 'EN_PROGRESO'
          )
        }
      } catch (err) {
        console.error('Error finding active goal:', err)
      }

      if (existingActiveGoal) {
        await fetch(`${API_CONFIG.BASE_URL}/objetivos-paciente/${existingActiveGoal.id}/`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            objetivo: fichaFormData.objetivo_choice,
            fecha_meta: fichaFormData.fecha_meta || null
          })
        })
      } else {
        await fetch(`${API_CONFIG.BASE_URL}/objetivos-paciente/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            paciente: pacienteData.id,
            objetivo: fichaFormData.objetivo_choice,
            fecha_meta: fichaFormData.fecha_meta || null,
            estado: 'EN_PROGRESO'
          })
        })
      }

      // 3. Log daily symptoms entry (SintomaDiario)
      try {
        const sintListRes = await fetch(`${API_CONFIG.BASE_URL}/sintomas-diarios/?page_size=100`, { headers })
        const todayStr = new Date().toISOString().split('T')[0]
        let existingSintoma: any = null
        if (sintListRes.ok) {
          const listData = await sintListRes.ok ? await sintListRes.json() : []
          const list = listData.results || listData
          existingSintoma = (list || []).find((s: any) => s.fecha === todayStr)
        }

        if (existingSintoma) {
          await fetch(`${API_CONFIG.BASE_URL}/sintomas-diarios/${existingSintoma.id}/`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              paciente: pacienteData.id,
              sintoma: fichaFormData.sintoma_choice,
              fecha: todayStr,
              notas: fichaFormData.sintoma_notas
            })
          })
        } else {
          await fetch(`${API_CONFIG.BASE_URL}/sintomas-diarios/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              paciente: pacienteData.id,
              sintoma: fichaFormData.sintoma_choice,
              fecha: todayStr,
              notas: fichaFormData.sintoma_notas
            })
          })
        }
      } catch (err) {
        console.error('Symptoms logging encountered a silent error:', err)
      }

      alert('Ficha diaria registrada de manera exitosa.')
      loadPatientProfile()
    } catch (error) {
      console.error('Error saving patient profile checklist:', error)
      alert('Error guardando perfil: ' + error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !userProfileData) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const response = await fetch(`${API_CONFIG.BASE_URL}/profiles/${userProfileData.id}/`, {
        method: 'PATCH',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      })
      if (response.ok) {
        loadUserProfile()
        alert('Foto de perfil actualizada.')
      } else {
        alert('Error al subir la imagen. Verifica el formato.')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
    }
  }

  useEffect(() => {
    loadUserProfile()
    loadPatientProfile()
  }, [user])

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'
  const waterProgressPct = Math.min((waterLogToday / 2000) * 100, 100)

  // IMC Calculation fallback helper
  const calculateIMC = () => {
    if (pacienteData?.bmi) return Number(pacienteData.bmi).toFixed(1)
    const weight = Number(fichaFormData.current_weight.replace(',', '.'))
    const rawHeight = fichaFormData.height_cm.replace(',', '.')
    let height = Number(rawHeight)
    if (height > 3) height = height / 100 // convert to meters if cm
    if (weight && height) {
      return (weight / (height * height)).toFixed(1)
    }
    return 'N/D'
  }

  const formatHeight = (heightCm: any) => {
    if (!heightCm) return '0.00'
    const val = Number(heightCm)
    if (isNaN(val)) return '0.00'
    // If it's stored in cm (e.g. 159), divide by 100 to get meters (e.g. 1.59)
    const meters = val > 3 ? val / 100 : val
    return meters.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mb-4" />
        <p className="text-sm font-semibold">Cargando tu consultorio inteligente...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg-main text-text-main pb-28 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Floating white/dark Navbar */}
      <header className="sticky top-0 z-30 px-4 py-4 bg-header-bg backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-full bg-card-bg px-6 shadow-sm border border-card-border transition-all duration-300">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-input-bg text-slate-400 transition hover:bg-slate-500/10"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-xl font-black text-text-main tracking-widest uppercase transition-colors duration-300">
            Nutri<span className="text-emerald-500">Tec</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-400">
            <button onClick={() => navigate('/patient/menu')} className="text-emerald-500 font-bold transition">Inicio</button>
            <button onClick={() => navigate('/patient/plan')} className="hover:text-emerald-500 transition">Mi Plan</button>
            <button onClick={() => navigate('/patient/recipes')} className="hover:text-emerald-500 transition">Recetas</button>
            <button onClick={() => navigate('/patient/chat')} className="hover:text-emerald-500 transition">Chat</button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-input-bg text-slate-400 transition hover:bg-slate-500/10"
              title="Alternar modo claro/oscuro"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-400" />}
            </button>

            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-input-bg text-slate-400 transition hover:bg-slate-500/10">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">1</span>
            </button>
            <button className="overflow-hidden flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-extrabold text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {getAvatarUrl(userProfileData?.avatar_url) ? (
                <img src={getAvatarUrl(userProfileData?.avatar_url)!} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                initialLetter
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <div className={`fixed inset-0 z-40 transition ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <button type="button" aria-label="Cerrar menú" className={`absolute inset-0 bg-slate-950/60 backdrop-blur-[3px] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 flex h-full w-[min(86vw,420px)] flex-col overflow-hidden bg-slate-900 border-r border-white/5 shadow-[24px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="relative flex min-h-[260px] flex-col justify-between bg-gradient-to-b from-emerald-950 to-slate-900 px-6 pb-8 pt-7 text-white">
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition hover:bg-white/10">
              <PanelLeftClose className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-start gap-5">
              <div className="relative group/avatar cursor-pointer">
                <input 
                  type="file" 
                  id="avatar-upload-sidebar" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                />
                <label 
                  htmlFor="avatar-upload-sidebar"
                  className="cursor-pointer block overflow-hidden relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.2)] hover:border-emerald-500/50 transition-colors"
                >
                  {getAvatarUrl(userProfileData?.avatar_url) ? (
                    <img src={getAvatarUrl(userProfileData?.avatar_url)!} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle2 className="h-10 w-10 text-slate-400" />
                  )}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-emerald-400 text-center px-1">
                    Cambiar Foto
                  </div>
                </label>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-white">{user?.username}</p>
                <span className="mt-2.5 inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">Paciente</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            <nav className="space-y-2">
              <p className="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Mi Salud</p>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient') }} className="flex w-full items-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 text-left text-sm font-bold text-emerald-400">
                <House className="h-5 w-5 shrink-0" />
                <span>Inicio</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <UtensilsCrossed className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Mi Plan</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/recipes') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <ChefHat className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Recetas</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/chat') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <MessageSquareText className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Soporte por Chat</span>
              </button>
            </nav>

            <nav className="space-y-2">
              <p className="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Cuenta</p>
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-4 rounded-2xl border border-rose-500/10 px-4 py-3.5 text-left text-sm font-semibold text-rose-400 hover:bg-rose-500/5 transition">
                <LogOut className="h-5 w-5 shrink-0 text-rose-400" />
                <span>Cerrar sesión</span>
              </button>
            </nav>
          </div>
        </aside>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-[1600px] px-4 pt-6 space-y-8">
        
        {/* Welcome Section & Quick log */}
        <section className="grid gap-6 lg:grid-cols-12 items-stretch animate-fade-in">
          {/* Left Column: Welcome box */}
          <div className="lg:col-span-7 rounded-3xl bg-card-bg border border-card-border p-6 sm:p-8 shadow-sm flex flex-col justify-between h-full transition-all duration-300">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase">NutriTec Dashboard</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-main leading-tight uppercase">
                Listo para tu <br />
                <span className="text-emerald-500">transformación de salud</span>
              </h1>
              <p className="max-w-md text-sm text-slate-400 leading-relaxed font-semibold">
                Bienvenido de vuelta, <span className="text-text-main font-extrabold">{user?.username}</span>. Registra tus hábitos diarios y consulta las recetas preparadas por tu nutricionista.
              </p>
            </div>

            <div className="mt-6 w-full h-56 relative rounded-2xl overflow-hidden border border-card-border shadow-sm animate-float bg-input-bg shrink-0 transition-all duration-300">
              <img 
                src="/assets/patient_banner.png" 
                alt="Dashboard Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent flex items-end p-4">
                <p className="text-xs font-bold text-white drop-shadow">Nutrición Inteligente</p>
              </div>
            </div>
          </div>

          {/* Right Column: Keep up with NutriTec (Symptom Log Form) */}
          <div className="lg:col-span-5 rounded-3xl bg-card-bg border border-card-border p-6 sm:p-8 text-text-main shadow-xl flex flex-col justify-between transition-all duration-300">
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight">Mi Estado de Hoy</h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Ayuda a tu nutricionista a entender cómo evoluciona tu cuerpo registrando tus métricas y síntomas del día.
              </p>
            </div>

            <form onSubmit={handleSaveFicha} className="mt-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Edad</span>
                    <input 
                      type="number"
                      required
                      value={fichaFormData.age}
                      onChange={e => setFichaFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="mt-1 w-full rounded-xl bg-input-bg border border-card-border p-2.5 text-xs text-text-main outline-none focus:border-emerald-500 transition-all duration-300"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Peso (kg)</span>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={fichaFormData.current_weight}
                      onChange={e => setFichaFormData(prev => ({ ...prev, current_weight: e.target.value }))}
                      className="mt-1 w-full rounded-xl bg-input-bg border border-card-border p-2.5 text-xs text-text-main outline-none focus:border-emerald-500 transition-all duration-300"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Altura (cm)</span>
                    <input 
                      type="number"
                      step="0.1"
                      required
                      value={fichaFormData.height_cm}
                      onChange={e => setFichaFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                      className="mt-1 w-full rounded-xl bg-input-bg border border-card-border p-2.5 text-xs text-text-main outline-none focus:border-emerald-500 transition-all duration-300"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">¿Cómo te sientes?</span>
                    <select 
                      value={fichaFormData.sintoma_choice}
                      onChange={e => setFichaFormData(prev => ({ ...prev, sintoma_choice: e.target.value }))}
                      className="mt-1 w-full rounded-xl bg-input-bg border border-card-border p-2.5 text-xs text-text-main outline-none focus:border-emerald-500 transition-all duration-300"
                    >
                      <option value="EXCELENTE">Excelente</option>
                      <option value="BUENA_ENERGIA">Buena energía</option>
                      <option value="ANSIEDAD">Ansiedad</option>
                      <option value="CANSANCIO">Cansancio</option>
                      <option value="DOLOR_CABEZA">Dolor de cabeza</option>
                      <option value="HAMBRE_EXCESIVA">Hambre excesiva</option>
                      <option value="SUEÑO_MALO">Mal sueño</option>
                      <option value="SUEÑO_BUENO">Buen sueño</option>
                      <option value="DIGESTION">Problemas Digestivos</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Objetivo</span>
                    <select 
                      value={fichaFormData.objetivo_choice}
                      onChange={e => setFichaFormData(prev => ({ ...prev, objetivo_choice: e.target.value }))}
                      className="mt-1 w-full rounded-xl bg-input-bg border border-card-border p-2.5 text-xs text-text-main outline-none focus:border-emerald-500 transition-all duration-300"
                    >
                      <option value="BAJAR_PESO">Bajar peso</option>
                      <option value="GANAR_MASA">Ganar masa muscular</option>
                      <option value="MANTENER_PESO">Mantener peso</option>
                      <option value="REDUCIR_GRASA">Reducir grasa corporal</option>
                      <option value="MEJORAR_SALUD">Mejorar salud general</option>
                      <option value="MEJORAR_RENDIMIENTO">Rendimiento deportivo</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Notas sobre tus síntomas</span>
                  <input 
                    type="text"
                    placeholder="Ej: Siento algo de cansancio por la tarde..."
                    value={fichaFormData.sintoma_notas}
                    onChange={e => setFichaFormData(prev => ({ ...prev, sintoma_notas: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-input-bg border border-card-border p-2.5 text-xs text-text-main outline-none focus:border-emerald-500 transition-all duration-300"
                  />
                </label>
              </div>

              <button 
                type="submit"
                className="mt-6 w-full rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs uppercase tracking-widest py-3.5 transition shadow-lg shadow-emerald-500/10"
              >
                Registrar Estado
              </button>
            </form>
          </div>
        </section>

        {/* Warning Banner if profile not complete */}
        {pacienteData && (!pacienteData.current_weight || !pacienteData.height_cm) && (
          <section className="rounded-2xl border border-amber-200/20 bg-amber-500/10 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-amber-300">
            <div>
              <p className="font-bold text-base">⚠️ Ficha médica incompleta</p>
              <p className="text-sm text-slate-400 mt-1">Por favor completa tu peso y altura en el panel derecho para poder calcular tu IMC y habilitar tu plan.</p>
            </div>
          </section>
        )}

        {/* Three visual cards (like the Rivian layout) */}
        <section className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: Hidratación */}
          <article className="overflow-hidden rounded-3xl bg-card-bg border border-card-border shadow-sm flex flex-col justify-between group h-[340px] transition-all duration-300">
            <div className="relative h-44 overflow-hidden bg-slate-800">
              <img 
                src="/assets/hydration_banner.png" 
                alt="Hidratación" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 rounded-full bg-sky-500 text-slate-950 font-extrabold text-xs px-3 py-1">
                {Math.round(waterProgressPct)}%
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-text-main">Seguimiento de Hidratación</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Meta de hoy: 2.0L (Consumo: {(waterLogToday / 1000).toFixed(2)} L)</p>
              </div>

              <button 
                onClick={handleAddWater}
                className="w-full rounded-full border border-sky-500/20 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs py-2.5 transition"
              >
                + Registrar 250ml
              </button>
            </div>
          </article>

          {/* Card 2: Recetas */}
          <article 
            onClick={() => navigate('/patient/recipes')}
            className="cursor-pointer overflow-hidden rounded-3xl bg-card-bg border border-card-border shadow-sm flex flex-col justify-between group h-[340px] transition-all duration-300"
          >
            <div className="relative h-44 overflow-hidden bg-slate-850">
              <img 
                src="/assets/recipe_banner.png" 
                alt="Recetas" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-3 py-1 uppercase tracking-wider">
                Nutritivo
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-text-main">Recetas del Plan</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Explora las comidas saludables diseñadas para tu plan de dieta.</p>
              </div>

              <div className="w-full flex items-center justify-between text-xs font-bold text-emerald-500 group-hover:underline">
                <span>Ver catálogo de recetas</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </article>

          {/* Card 3: Progreso */}
          <article className="overflow-hidden rounded-3xl bg-card-bg border border-card-border shadow-sm flex flex-col justify-between group h-[340px] transition-all duration-300">
            <div className="relative h-44 overflow-hidden bg-slate-850">
              <img 
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80" 
                alt="Progreso" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-extrabold text-[10px] px-3 py-1 uppercase tracking-wider">
                IMC {calculateIMC()}
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Peso Actual</span>
                  <span className="text-lg font-black text-text-main">{pacienteData?.current_weight ? `${pacienteData.current_weight}` : '0.0'} kg</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Estatura</span>
                  <span className="text-lg font-black text-text-main">{formatHeight(pacienteData?.height_cm)} m</span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-500 block leading-relaxed truncate">
                Meta: {pacienteData?.goal ? pacienteData.goal : 'Sin registrar'}
              </span>
            </div>
          </article>

        </section>

        {/* Historial Antropométrico */}
        <section className="rounded-3xl bg-card-bg border border-card-border p-6 sm:p-8 shadow-sm space-y-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-text-main">Historial de Progreso Corporal</h3>
            <span className="text-xs font-semibold text-slate-400">Total de controles: {pacienteData?.seguimientos?.length || 0}</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-card-border">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-input-bg text-slate-450 uppercase font-bold border-b border-card-border">
                <tr>
                  <th className="px-4 py-3.5 text-slate-400">Fecha</th>
                  <th className="px-4 py-3.5 text-slate-400">Peso</th>
                  <th className="px-4 py-3.5 text-slate-400">Cintura</th>
                  <th className="px-4 py-3.5 text-slate-400">Nota del Nutricionista</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border bg-card-bg text-slate-400 font-semibold">
                {(pacienteData?.seguimientos || []).map((ev: any) => (
                  <tr key={ev.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="px-4 py-3.5">{new Date(ev.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5 font-bold text-text-main">{ev.weight_kg} kg</td>
                    <td className="px-4 py-3.5">{ev.waist_cm ? `${ev.waist_cm} cm` : 'N/D'}</td>
                    <td className="px-4 py-3.5 text-slate-400">{ev.notes || 'Control de rutina'}</td>
                  </tr>
                ))}
                {(!pacienteData?.seguimientos || pacienteData.seguimientos.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">Aún no tienes controles registrados por tu nutricionista.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Meal & Next consultation Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          
          {/* Next Meal */}
          <article className="rounded-3xl bg-card-bg border border-card-border p-6 shadow-sm space-y-4 transition-all duration-300">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Siguiente Comida del Plan</h2>
            
            {meals.map((item) => (
              <div key={item.title} className="flex items-center gap-4 rounded-2xl bg-input-bg p-4 border border-card-border transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-text-main">{item.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-emerald-500" /> {item.time}</span>
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" /> {item.calories}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            ))}
          </article>

          {/* Consultation Alerts */}
          <article className="rounded-3xl bg-card-bg border border-card-border p-6 shadow-sm space-y-4 flex flex-col justify-between transition-all duration-300">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Cita Programada</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                  <CalendarCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-text-main">Lunes, 24 de Julio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">10:00 AM - Dra. Maria Cosio</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/patient/chat')}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-text-main hover:bg-slate-500/15 hover:text-emerald-500 py-3.5 text-xs font-extrabold uppercase tracking-widest text-bg-main border border-card-border transition mt-4"
            >
              <MessageSquareText className="h-4 w-4" />
              Chatear con Nutricionista
            </button>
          </article>

        </section>

      </div>

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-3xl border border-card-border bg-card-bg/95 backdrop-blur-xl shadow-lg p-2.5 md:hidden transition-all duration-300">
        <div className="grid grid-cols-4 items-center">
          {bottomNav.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === 'Inicio') navigate('/patient/menu')
                if (label === 'Mi Plan') navigate('/patient/plan')
                if (label === 'Recetas') navigate('/patient/recipes')
                if (label === 'Chat') navigate('/patient/chat')
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition ${
                active 
                  ? 'text-emerald-500 bg-emerald-500/5' 
                  : 'text-slate-450 hover:text-emerald-500 hover:bg-slate-500/5'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  )
}