// src/presentation/pages/patient/PatientPlanPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  Menu, 
  PanelLeftClose, 
  UtensilsCrossed, 
  ChefHat, 
  MessageSquareText, 
  LogOut, 
  House, 
  Camera,
  ArrowRight,
  Flame,
  CalendarDays,
  Target,
  Sparkles,
  CheckCircle2,
  Circle,
  Star,
  Sun,
  Moon,
  UserCircle2
} from 'lucide-react'

// Profile Avatar secure URL resolution helper
const getAvatarUrl = (url: string | null | undefined) => {
  if (!url) return null
  if (url.includes('localhost:8000')) {
    return url.replace('http://localhost:8000', '')
  }
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }
  return url
}

interface MealItem {
  title: string
  time: string
  detail: string
  status: string
}

interface RoutineDay {
  day: string
  activity: string
  completed: boolean
}

interface Achievement {
  title: string
  points: string
}

interface NutritionPlan {
  id: number
  name: string
  calories: string
  week: string
  progress: number
  hydration: string
  nextConsult: string
  nutricionista: string
}

const fallbackMealPlan: MealItem[] = [
  { title: 'Desayuno', time: '08:00 AM', detail: 'Avena con fresas, chía y yogur griego sin azúcar.', status: 'Completado' },
  { title: 'Media mañana', time: '10:30 AM', detail: 'Una manzana verde + 10 almendras tostadas.', status: 'Pendiente' },
  { title: 'Almuerzo', time: '13:30 PM', detail: 'Pechuga a la plancha con ensalada verde y quinua.', status: 'Programado' }
]

const fallbackRoutineDays: RoutineDay[] = [
  { day: 'Lunes', activity: 'Entrenamiento de Fuerza - Tren Superior (Pecho, Espalda)', completed: true },
  { day: 'Martes', activity: 'Cardio de Intensidad Moderada - Trotar 40 minutos', completed: false },
  { day: 'Miércoles', activity: 'Entrenamiento de Fuerza - Tren Inferior (Piernas)', completed: true },
  { day: 'Jueves', activity: 'Descanso Activo - Caminata suave 30 minutos', completed: false }
]

const fallbackAchievements: Achievement[] = [
  { title: '7 días de adherencia perfecta', points: '+150 pts' },
  { title: 'Meta de hidratación alcanzada', points: '+50 pts' }
]

const bottomNav = [
  { label: 'Inicio', icon: House, active: false },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: true },
  { label: 'Recetas', icon: ChefHat, active: false },
  { label: 'Progreso', icon: Camera, active: false },
  { label: 'Chat', icon: MessageSquareText, active: false },
]

export default function PatientPlanPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'dieta' | 'rutina' | 'logros'>('dieta')
  const [loading, setLoading] = useState(true)
  
  const [activePlan, setActivePlan] = useState<NutritionPlan | null>(null)
  const [userProfileData, setUserProfileData] = useState<any | null>(null)

  // Dark/Light Theme state toggle
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
        const results = data.results || data
        if (Array.isArray(results) && results.length > 0) {
          setUserProfileData(results[0])
        }
      }
    } catch (err) {
      console.error('Error loading user profile:', err)
    }
  }

  const loadPatientPlan = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/pacientes/`, { headers })
      if (response.ok) {
        const data = await response.json()
        const patientObj = data.results ? data.results[0] : data[0]
        if (patientObj && patientObj.plan_activo) {
          const plan = patientObj.plan_activo
          setActivePlan({
            id: plan.id,
            name: plan.nombre || 'Plan Nutricional',
            calories: plan.calorias ? `${plan.calorias} kcal` : '1500 kcal',
            week: 'Semana 1 de 4',
            progress: 45,
            hydration: '1.2 L / 2.0 L',
            nextConsult: 'Lunes, 24 de Julio - 10:00 AM',
            nutricionista: 'Dra. Maria Cosio'
          })
        }
      }
    } catch (error) {
      console.error('Error loading active diet plan:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadUserProfile()
      loadPatientPlan()
    }
  }, [user])

  const handleOfflinePlanBypass = () => {
    setActivePlan({
      id: 999,
      name: 'Plan Verano',
      calories: '1500 kcal',
      week: 'Semana 1 de 4',
      progress: 45,
      hydration: '1.2 L / 2.0 L',
      nextConsult: 'Lunes, 24 de Julio - 10:00 AM',
      nutricionista: 'Dra. Maria Cosio'
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'
  const planTabs = [
    { id: 'dieta', label: 'Dieta recomendada', icon: UtensilsCrossed },
    { id: 'rutina', label: 'Rutina asociada', icon: Target },
    { id: 'logros', label: 'Logros desbloqueados', icon: Star }
  ] as const

  const avatarUrlResolved = getAvatarUrl(userProfileData?.avatar_url)

  return (
    <main className="min-h-screen bg-bg-main text-text-main pb-28 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Ambient glowing circles */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-card-border bg-header-bg backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-400">
            <button onClick={() => navigate('/patient/menu')} className="hover:text-emerald-500 transition">Inicio</button>
            <button onClick={() => navigate('/patient/plan')} className="text-emerald-500 font-bold transition">Mi Plan</button>
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

            <button className="overflow-hidden flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-extrabold text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {avatarUrlResolved ? (
                <img src={avatarUrlResolved} alt="Profile" className="h-full w-full object-cover" />
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
              <div className="overflow-hidden flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
                {avatarUrlResolved ? (
                  <img src={avatarUrlResolved} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 className="h-10 w-10" />
                )}
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
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <House className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Inicio</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className="flex w-full items-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 text-left text-sm font-bold text-emerald-400">
                <UtensilsCrossed className="h-5 w-5 shrink-0" />
                <span>Mi Plan</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/recipes') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <ChefHat className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Recetas</span>
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

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1200px] px-4 pt-8 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-card-border bg-card-bg/40 backdrop-blur-md shadow-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-semibold">Cargando tu plan nutricional...</p>
          </div>
        ) : !activePlan ? (
          <section className="rounded-[2rem] border border-card-border bg-card-bg p-6 sm:p-10 backdrop-blur-xl shadow-sm text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <UtensilsCrossed className="h-10 w-10 animate-bounce" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold text-text-main">No tienes un plan activo</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Parece que aún no tienes asignado ningún plan de alimentación en el consultorio. ¡Adquiere uno del catálogo o activa el plan demo offline!
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate('/patient/plans')}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-450 transition shadow-md shadow-emerald-500/15"
              >
                Ver Catálogo de Planes
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={handleOfflinePlanBypass}
                className="inline-flex items-center gap-2 rounded-2xl border border-card-border bg-input-bg px-6 py-3.5 text-sm font-bold text-text-main hover:bg-slate-500/10 transition"
              >
                Activar Plan Demo Offline
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-[2.5rem] border border-card-border bg-card-bg p-6 sm:p-8 backdrop-blur-xl shadow-sm space-y-8 transition-all duration-300">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Plan Nutricional Activo</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text-main uppercase">Dieta, Nutrición y Progreso</h1>
                <p className="mt-2.5 text-sm text-slate-400">Control de metas de salud supervisado por: <span className="font-bold text-emerald-500">{activePlan.nutricionista}</span>.</p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4.5 py-2.5 text-sm font-bold text-emerald-400 shadow-sm shadow-emerald-500/5">
                <Sparkles className="h-4.5 w-4.5 animate-spin" />
                Seguimiento Médico Activo
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <article className="rounded-3xl border border-card-border bg-input-bg p-6 shadow-md md:col-span-2 space-y-5 relative overflow-hidden transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-md">
                    <Target className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-550 tracking-wider uppercase">Plan Asignado</p>
                    <h2 className="text-xl font-bold text-text-main leading-tight">{activePlan.name}</h2>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-3 text-center">
                  <div className="rounded-2xl border border-card-border bg-card-bg py-2.5 transition-all duration-300">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Calorías</p>
                    <div className="mt-1 font-bold text-text-main text-sm">{activePlan.calories}</div>
                  </div>
                  <div className="rounded-2xl border border-card-border bg-card-bg py-2.5 transition-all duration-300">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Estado</p>
                    <div className="mt-1 font-bold text-emerald-450 text-sm">{activePlan.week}</div>
                  </div>
                  <div className="rounded-2xl border border-card-border bg-card-bg py-2.5 transition-all duration-300">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Hidratación</p>
                    <div className="mt-1 font-bold text-sky-400 text-sm">{activePlan.hydration}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Adherencia General</span>
                    <span>{activePlan.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-500/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${activePlan.progress}%` }} />
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-card-border bg-input-bg p-5 space-y-2 flex flex-col justify-between shadow-inner transition-all duration-300">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PRÓXIMO CONTROL</p>
                  <div className="mt-3 flex items-start gap-2.5">
                    <CalendarDays className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-text-main text-xs leading-snug">{activePlan.nextConsult}</h3>
                      <p className="mt-1 text-[10px] text-slate-500">Evaluación antropométrica y física.</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-card-border bg-input-bg p-5 space-y-2 flex flex-col justify-between shadow-inner transition-all duration-300">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LÍMITE DIARIO</p>
                  <div className="mt-3 flex items-center gap-2.5">
                    <Flame className="h-5 w-5 text-orange-400 shrink-0" />
                    <div>
                      <h3 className="font-bold text-text-main text-sm">{activePlan.calories}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Fraccionado en comidas.</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Interactive Custom Tabs */}
            <div className="flex gap-2 border-b border-card-border pb-3 overflow-x-auto">
              {planTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button 
                    key={tab.id} 
                    type="button" 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider transition ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                        : 'border border-card-border bg-input-bg text-slate-400 hover:text-emerald-500 hover:bg-slate-500/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <section className="rounded-3xl border border-card-border bg-input-bg p-5 sm:p-6 shadow-inner transition-all duration-300">
                {activeTab === 'dieta' ? (
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-500">Menú Recomendado por Nutricionista</h2>
                    <div className="space-y-3">
                      {fallbackMealPlan.map((item) => (
                        <article key={item.title} className="flex items-center gap-4 rounded-2xl border border-card-border bg-card-bg p-4 hover:border-emerald-500/40 transition duration-300">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><UtensilsCrossed className="h-5 w-5" /></div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-bold text-sm text-text-main">{item.title}</h3>
                              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-655" />
                              <span className="text-xs text-slate-500">{item.time}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400 leading-normal">{item.detail}</p>
                          </div>
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-500">{item.status}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'rutina' ? (
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-500">Rutina Semanal de Recomposición</h2>
                    <div className="space-y-3">
                      {fallbackRoutineDays.map((item) => (
                        <article key={item.day} className="flex items-center justify-between rounded-2xl border border-card-border bg-card-bg p-4">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-input-bg text-slate-550'}`}>
                              {item.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                            </div>
                            <div><h3 className="font-bold text-sm text-text-main">{item.day}</h3><p className="mt-1 text-xs text-slate-400">{item.activity}</p></div>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${item.completed ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-input-bg border border-card-border text-slate-500'}`}>{item.completed ? 'Completado' : 'Pendiente'}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'logros' ? (
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-500">Avance y Logros Desbloqueados</h2>
                    <div className="space-y-3">
                      {fallbackAchievements.map((item) => (
                        <article key={item.title} className="rounded-2xl border border-card-border bg-card-bg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"><Star className="h-5 w-5" /></div>
                            <h3 className="font-bold text-xs text-text-main">{item.title}</h3>
                          </div>
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-550">{item.points}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <aside className="space-y-6">
                <article className="rounded-3xl border border-emerald-500/20 bg-card-bg p-6 shadow-sm space-y-4 transition-all duration-300">
                  <h2 className="text-base font-extrabold text-text-main uppercase">Subir Foto de Avance</h2>
                  <p className="text-xs text-slate-400 leading-normal">
                    Registra tu evolución corporal cargando una imagen directamente al servidor local.
                  </p>
                  <button type="button" onClick={() => navigate('/patient/photos')} className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-xs font-extrabold uppercase tracking-widest text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10">Subir Foto de Progreso <ArrowRight className="h-4 w-4" /></button>
                </article>

                <article className="rounded-3xl border border-card-border bg-input-bg p-5 space-y-3 transition-all duration-300">
                  <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resumen Semanal</h2>
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center justify-between rounded-xl bg-card-bg px-3 py-2.5 transition-colors duration-300"><span>Calorías diarias</span><span className="font-bold text-text-main">1,850 kcal</span></div>
                    <div className="flex items-center justify-between rounded-xl bg-card-bg px-3 py-2.5 transition-colors duration-300"><span>Comidas del día</span><span className="font-bold text-text-main">4 programadas</span></div>
                    <div className="flex items-center justify-between rounded-xl bg-card-bg px-3 py-2.5 transition-colors duration-300"><span>Hidratación</span><span className="font-bold text-text-main">1.2 / 2.0 L</span></div>
                  </div>
                </article>
              </aside>
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-3xl border border-card-border bg-card-bg/95 backdrop-blur-xl shadow-lg p-2.5 md:hidden transition-all duration-300">
        <div className="grid grid-cols-5 items-center">
          {bottomNav.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === 'Inicio') navigate('/patient/menu')
                if (label === 'Mi Plan') navigate('/patient/plan')
                if (label === 'Recetas') navigate('/patient/recipes')
                if (label === 'Progreso') navigate('/patient/photos')
                if (label === 'Chat') navigate('/patient/chat')
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition ${
                active 
                  ? 'text-emerald-500 bg-emerald-500/5' 
                  : 'text-slate-455 hover:text-emerald-500 hover:bg-slate-500/5'
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