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
  Droplets, 
  Footprints, 
  House, 
  Menu, 
  MessageSquareText, 
  PanelLeftClose, 
  ShieldPlus, 
  UtensilsCrossed, 
  UserCircle2,
  LogOut,
  Sparkles,
  Flame,
  Camera,
  Activity,
  Plus
} from 'lucide-react'

const meals = [
  {
    title: 'Almuerzo: Pechuga a la plancha con quinua',
    time: '13:30 PM',
    calories: '550 kcal',
    icon: UtensilsCrossed,
  },
]

const bottomNav = [
  { label: 'Inicio', icon: House, active: true },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
  { label: 'Progreso', icon: Footprints, active: false },
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
  const [showFichaModal, setShowFichaModal] = useState(false)

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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const loadPatientProfile = async () => {
    try {
      setLoadingProfile(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/pacientes/?page_size=100`, { headers })
      if (response.ok) {
        const data = await response.json()
        const results = data.results || data
        const myPatient = (results || []).find((p: any) => p.user_id === user?.id)
        if (myPatient) {
          setPacienteData(myPatient)
          setFichaFormData(prev => ({
            ...prev,
            age: myPatient.age ? String(myPatient.age) : '',
            current_weight: myPatient.current_weight ? String(myPatient.current_weight) : '',
            height_cm: myPatient.height_cm ? String(Number(myPatient.height_cm) > 3 ? Number(myPatient.height_cm) / 100 : myPatient.height_cm).replace('.', ',') : '',
            goal: myPatient.goal || '',
            dietary_restrictions: myPatient.dietary_restrictions || ''
          }))
          loadWaterLog(myPatient.id)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProfile(false)
    }
  }

  const loadWaterLog = async (pacienteId: number) => {
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/registros-agua/?page_size=100`, { headers })
      if (response.ok) {
        const data = await response.json()
        const results = data.results || data
        const todayStr = new Date().toISOString().split('T')[0]
        
        const totalMl = (results || [])
          .filter((reg: any) => reg.paciente === pacienteId && reg.fecha === todayStr)
          .reduce((sum: number, reg: any) => sum + (reg.cantidad_ml || 0), 0)
        
        setWaterLogToday(totalMl)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddWater = async () => {
    if (!pacienteData) return
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
      const todayStr = new Date().toISOString().split('T')[0]

      const response = await fetch(`${API_CONFIG.BASE_URL}/registros-agua/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          paciente: pacienteData.id,
          fecha: todayStr,
          cantidad_ml: 250
        })
      })

      if (response.ok) {
        setWaterLogToday(prev => prev + 250)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveFicha = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pacienteData) {
      alert('No se pudo encontrar tu perfil de paciente.')
      return
    }

    const cleanHeight = (val: string) => {
      if (!val) return 0
      const cleaned = parseFloat(val.replace(',', '.'))
      if (isNaN(cleaned)) return 0
      // If they entered height in meters (e.g. 1.59 or 1.8), convert to centimeters (159 or 180)
      if (cleaned < 3) {
        return Math.round(cleaned * 100)
      }
      return cleaned
    }

    const cleanWeight = (val: string) => {
      if (!val) return 0
      const cleaned = parseFloat(val.replace(',', '.'))
      return isNaN(cleaned) ? 0 : cleaned
    }

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }

      const parsedHeight = cleanHeight(fichaFormData.height_cm)
      const parsedWeight = cleanWeight(fichaFormData.current_weight)

      // 1. Update Paciente Profile
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

      // 2. Create ObjetivoPaciente
      const objResponse = await fetch(`${API_CONFIG.BASE_URL}/objetivos-paciente/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          paciente: pacienteData.id,
          objetivo: fichaFormData.objetivo_choice,
          fecha_inicio: new Date().toISOString().split('T')[0],
          fecha_meta: fichaFormData.fecha_meta,
          estado: 'EN_PROGRESO'
        })
      })

      if (!objResponse.ok) {
        const errorData = await objResponse.json()
        throw new Error('Error en Objetivo de Paciente: ' + JSON.stringify(errorData))
      }

      // 3. Create SintomaDiario (optional failure tolerance)
      try {
        const todayStr = new Date().toISOString().split('T')[0]
        await fetch(`${API_CONFIG.BASE_URL}/sintomas-diarios/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            paciente: pacienteData.id,
            fecha: todayStr,
            sintoma: fichaFormData.sintoma_choice,
            notas: fichaFormData.sintoma_notas || 'Auto-registro inicial'
          })
        })
      } catch (sintErr) {
        console.warn('Sintoma ya registrado hoy o error menor:', sintErr)
      }

      alert('¡Información médica guardada con éxito!')
      setShowFichaModal(false)
      loadPatientProfile()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Error al guardar la información')
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadPatientProfile()
    }
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
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Glow ambient background elements */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Premium Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <ShieldPlus className="h-5 w-5" />
            </span>
            Consultorio <span className="text-emerald-400">Dietético</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/patient/menu')} className="text-sm font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition">Inicio</button>
            <button onClick={() => navigate('/patient/plan')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white transition">Mi Plan</button>
            <button onClick={() => navigate('/patient/photos')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white transition">Progreso</button>
            <button onClick={() => navigate('/patient/chat')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white transition">Chat</button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-slate-950">1</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-extrabold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {initialLetter}
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
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
                <UserCircle2 className="h-10 w-10" />
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
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/photos') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <Camera className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Seguimiento</span>
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
      <div className="mx-auto max-w-[1200px] px-4 pt-8 space-y-8">
        
        {/* Welcome Premium Card */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-[-30%] right-[-10%] -z-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-emerald-400 shadow-[0_8px_20px_rgba(16,185,129,0.15)]">
                <UserCircle2 className="h-10 w-10 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Bienvenido de vuelta,</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {user?.username}
                </h1>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFichaModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 transition shadow-lg shadow-emerald-500/20"
              >
                <Activity className="h-4.5 w-4.5" />
                Actualizar Ficha Médica
              </button>
              
              <button
                onClick={handleLogout}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-slate-950 transition shadow-lg"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Warning Banner if profile not complete */}
        {pacienteData && (!pacienteData.current_weight || !pacienteData.height_cm) && (
          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/15 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-amber-200">
            <div>
              <p className="font-bold text-base">⚠️ Ficha médica incompleta</p>
              <p className="text-sm text-amber-300 mt-1">Por favor completa tu evaluación inicial (peso, altura) para poder calcular tu IMC y diseñar tu plan.</p>
            </div>
            <button
              onClick={() => setShowFichaModal(true)}
              className="rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 shrink-0 transition"
            >
              Completar Ficha
            </button>
          </section>
        )}

        {/* Daily Summary Rings/Stats Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          
          {/* Water card with dynamic tracking */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">CONSUMO DE AGUA</p>
              <div className="text-4xl font-extrabold text-white">{(waterLogToday / 1000).toFixed(2)} <span className="text-xl font-medium text-slate-400">L</span></div>
              <p className="text-xs text-slate-500 font-semibold">Meta diaria: 2.0 L ({waterLogToday} ml)</p>
              <button 
                onClick={handleAddWater}
                className="mt-3 flex items-center gap-1.5 rounded-xl border border-sky-500/20 bg-sky-500/10 hover:bg-sky-500 hover:text-slate-950 font-bold px-3 py-1.5 text-xs text-sky-400 transition"
              >
                <Plus className="h-4 w-4" />
                Registrar 250ml
              </button>
            </div>
            
            {/* SVG Progress Circle */}
            <div className="relative h-24 w-24 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-sky-500 transition-all duration-500" strokeWidth="3.2" strokeDasharray={`${waterProgressPct}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="h-6 w-6 text-sky-500" />
                <span className="text-[10px] font-bold text-sky-400 mt-0.5">{Math.round(waterProgressPct)}%</span>
              </div>
            </div>
          </article>

          {/* Activity/Calories */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">ACTIVIDAD FÍSICA</p>
              <div className="text-4xl font-extrabold text-white">Completado</div>
              <p className="text-xs text-slate-500 font-semibold">Rutina cardiovascular de hoy</p>
            </div>

            <div className="relative h-20 w-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-amber-500 transition-all duration-500" strokeWidth="3.2" strokeDasharray="100, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Footprints className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </article>
        </section>

        {/* Physical Progress Dashboard */}
        <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Progreso Antropométrico</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              {pacienteData?.goal ? pacienteData.goal : 'Sin meta registrada'}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-2">
              <p className="text-xs font-bold text-slate-400">Peso Actual</p>
              <div className="text-3xl font-extrabold text-white">
                {pacienteData?.current_weight ? `${pacienteData.current_weight}` : '0.0'} <span className="text-base font-semibold text-slate-500">kg</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-2">
              <p className="text-xs font-bold text-slate-400">Estatura</p>
              <div className="text-3xl font-extrabold text-white">
                {formatHeight(pacienteData?.height_cm)} <span className="text-base font-semibold text-slate-500">m</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-2">
              <p className="text-xs font-bold text-slate-400">Índice de Masa Corporal (IMC)</p>
              <div className="text-3xl font-extrabold text-emerald-400">{calculateIMC()}</div>
            </div>
          </div>
        </section>

        {/* Historial Antropométrico */}
        <section className="rounded-3xl border border-white/5 bg-slate-900/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Historial de Progreso Corporal (Mis Controles)</h3>
            <span className="text-xs text-slate-400">Total de controles: {pacienteData?.seguimientos?.length || 0}</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Peso</th>
                  <th className="px-4 py-3">Cintura</th>
                  <th className="px-4 py-3">Progreso / Nota del Nutricionista</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-950/20 text-slate-300">
                {(pacienteData?.seguimientos || []).map((ev: any) => (
                  <tr key={ev.id}>
                    <td className="px-4 py-3">{new Date(ev.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-bold text-white">{ev.weight_kg} kg</td>
                    <td className="px-4 py-3">{ev.waist_cm ? `${ev.waist_cm} cm` : 'N/D'}</td>
                    <td className="px-4 py-3 text-slate-400">{ev.notes || 'Control de rutina'}</td>
                  </tr>
                ))}
                {(!pacienteData?.seguimientos || pacienteData.seguimientos.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-500">Aún no tienes controles registrados por tu nutricionista.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Meal & Next consultation Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          
          {/* Next Meal */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Siguiente Comida del Plan</h2>
            
            {meals.map((item) => (
              <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{item.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-emerald-400" /> {item.time}</span>
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-400" /> {item.calories}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600" />
              </div>
            ))}
          </article>

          {/* Consultation Alerts */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cita Programada</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <CalendarCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Lunes, 24 de Julio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">10:00 AM - Dra. Maria Cosio</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/patient/chat')}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-slate-950 hover:brightness-110 transition shadow-md shadow-emerald-500/10 mt-4"
            >
              <MessageSquareText className="h-4.5 w-4.5" />
              Chatear con Nutricionista
            </button>
          </article>

        </section>

      </div>

      {/* Form Ficha Modal */}
      {showFichaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-white">Ficha Médica y Síntomas</h2>
              <button 
                onClick={() => setShowFichaModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFicha} className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Antropometría Básica</p>
                <div className="grid gap-3 grid-cols-3">
                  <label className="block">
                    <span className="text-xs text-slate-400">Edad (años)</span>
                    <input 
                      type="number"
                      required
                      value={fichaFormData.age}
                      onChange={e => setFichaFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Peso (kg)</span>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={fichaFormData.current_weight}
                      onChange={e => setFichaFormData(prev => ({ ...prev, current_weight: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Altura (cm)</span>
                    <input 
                      type="number"
                      step="0.1"
                      required
                      value={fichaFormData.height_cm}
                      onChange={e => setFichaFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                    />
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="text-xs text-slate-400">Restricciones Alimentarias (alergias, etc.)</span>
                <input 
                  type="text"
                  placeholder="Ej: Ninguna, Sin gluten"
                  value={fichaFormData.dietary_restrictions}
                  onChange={e => setFichaFormData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                />
              </label>

              <label className="block">
                <span className="text-xs text-slate-400">Objetivo Clínico o de Salud</span>
                <input 
                  type="text"
                  required
                  placeholder="Ej: Bajar grasa corporal y mejorar condición física"
                  value={fichaFormData.goal}
                  onChange={e => setFichaFormData(prev => ({ ...prev, goal: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs text-slate-400">Objetivo (Tipo)</span>
                  <select 
                    value={fichaFormData.objetivo_choice}
                    onChange={e => setFichaFormData(prev => ({ ...prev, objetivo_choice: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                  >
                    <option value="BAJAR_PESO">Bajar peso</option>
                    <option value="GANAR_MASA">Ganar masa muscular</option>
                    <option value="MANTENER_PESO">Mantener peso</option>
                    <option value="REDUCIR_GRASA">Reducir grasa corporal</option>
                    <option value="MEJORAR_SALUD">Mejorar salud general</option>
                    <option value="MEJORAR_RENDIMIENTO">Mejorar rendimiento deportivo</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-slate-400">Fecha Meta del Objetivo</span>
                  <input 
                    type="date"
                    required
                    value={fichaFormData.fecha_meta}
                    onChange={e => setFichaFormData(prev => ({ ...prev, fecha_meta: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                  />
                </label>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Síntomas de Hoy</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs text-slate-400">¿Cómo te sientes hoy?</span>
                    <select 
                      value={fichaFormData.sintoma_choice}
                      onChange={e => setFichaFormData(prev => ({ ...prev, sintoma_choice: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
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
                    <span className="text-xs text-slate-400">Notas sobre tus síntomas</span>
                    <input 
                      type="text"
                      placeholder="Ej: Siento algo de pesadez o cansancio..."
                      value={fichaFormData.sintoma_notas}
                      onChange={e => setFichaFormData(prev => ({ ...prev, sintoma_notas: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 text-sm text-white focus:border-emerald-500"
                    />
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 transition shadow-lg shadow-emerald-500/20"
              >
                Guardar Ficha
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-2.5 md:hidden">
        <div className="grid grid-cols-4 items-center">
          {bottomNav.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === 'Inicio') navigate('/patient/menu')
                if (label === 'Mi Plan') navigate('/patient/plan')
                if (label === 'Progreso') navigate('/patient/photos')
                if (label === 'Chat') navigate('/patient/chat')
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition ${
                active 
                  ? 'text-emerald-400 bg-emerald-500/5' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
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