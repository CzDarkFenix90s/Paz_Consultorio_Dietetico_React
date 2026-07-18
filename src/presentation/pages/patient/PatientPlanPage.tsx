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
  ArrowRight,
  CalendarDays,
  Target,
  Sparkles,
  Star,
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
  { title: 'Almuerzo', time: '13:30 PM', detail: 'Pechuga a la plancha con encalada verde y quinua.', status: 'Programado' }
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
  { label: 'Chat', icon: MessageSquareText, active: false },
]

export default function PatientPlanPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'dieta' | 'rutina' | 'logros'>('dieta')
  const [loading, setLoading] = useState(true)
  
  const [activePlan, setActivePlan] = useState<NutritionPlan | null>(null)
  const [foods, setFoods] = useState<any[]>([])
  const [userProfileData, setUserProfileData] = useState<any | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

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
      
      // 1. Fetch current subscriptions for patient
      const subResponse = await fetch(`${API_CONFIG.BASE_URL}/suscripciones/?_t=${Date.now()}`, { headers })
      let dbg = `GET /suscripciones/ status: ${subResponse.status}. `
      let activePlanId: number | null = null
      let nutricionistaName = 'Dra. Maria Cosio'
      
      if (subResponse.ok) {
        const subData = await subResponse.json()
        const subs = Array.isArray(subData.results) ? subData.results : Array.isArray(subData) ? subData : []
        dbg += `Returned ${subs.length} subs. `
        const activeSub = subs.find((s: any) => s.estado === 'activo')
        if (activeSub && activeSub.plan) {
          activePlanId = activeSub.plan
          dbg += `Found active sub plan ID: ${activePlanId}. `
        }
      } else {
        dbg += `Error response body: ${await subResponse.text()}. `
      }
      
      // Fallback: If no active subscription, check /api/consultas/mine/
      if (!activePlanId) {
        dbg += `Checking consultations fallback. `
        const consultResponse = await fetch(`${API_CONFIG.BASE_URL}/consultas/mine/?_t=${Date.now()}`, { headers })
        dbg += `GET /consultas/mine/ status: ${consultResponse.status}. `
        if (consultResponse.ok) {
          const consultData = await consultResponse.json()
          const consults = Array.isArray(consultData.results) ? consultData.results : Array.isArray(consultData) ? consultData : []
          dbg += `Returned ${consults.length} consultations. `
          // Find the latest consultation with plan
          const latestConsult = consults.find((c: any) => c.plan_nutricional && ['programada', 'en_curso', 'completada'].includes(c.status))
          if (latestConsult) {
            activePlanId = latestConsult.plan_nutricional.id
            if (latestConsult.nutricionista) {
              const nut = latestConsult.nutricionista
              nutricionistaName = `${nut.first_name || ''} ${nut.last_name || ''}`.trim() || 'Dra. Maria Cosio'
            }
            dbg += `Found plan ID ${activePlanId} in latest consultation. `
          }
        }
      }
      
      if (activePlanId) {
        // 2. Fetch plan details and foods in parallel
        const [planResponse, foodsResponse] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}/planes/${activePlanId}/`, { headers }),
          fetch(`${API_CONFIG.BASE_URL}/planes/${activePlanId}/alimentos/`, { headers })
        ])
        
        dbg += `planResponse: ${planResponse.status}, foodsResponse: ${foodsResponse.status}. `
        
        if (planResponse.ok) {
          const planDetails = await planResponse.json()
          setActivePlan({
            id: planDetails.id,
            name: planDetails.name || planDetails.nombre || 'Plan Nutricional',
            calories: planDetails.target_calories ? `${planDetails.target_calories} kcal` : '1500 kcal',
            week: `Semana 1 de ${planDetails.duration_weeks || 4}`,
            progress: 45,
            hydration: '1.2 L / 2.0 L',
            nextConsult: 'Lunes, 24 de Julio - 10:00 AM',
            nutricionista: nutricionistaName
          })
          
          if (foodsResponse.ok) {
            const foodsData = await foodsResponse.json()
            const foodItems = Array.isArray(foodsData) ? foodsData : Array.isArray(foodsData.results) ? foodsData.results : []
            setFoods(foodItems)
          }
          setDebugInfo('')
          return
        }
      }
      
      setDebugInfo(dbg)
      setActivePlan(null)
      setFoods([])
    } catch (error: any) {
      console.error('Error loading active diet plan:', error)
      setDebugInfo(`JS Exception: ${error?.message || error}. `)
      setActivePlan(null)
      setFoods([])
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
    setFoods([])
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

      {/* Drawer Sidebar Menu (Mobile) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-card-border bg-card-bg/95 backdrop-blur-xl p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-card-border pb-5">
          <div className="text-lg font-black text-text-main tracking-widest uppercase">
            Nutri<span className="text-emerald-500">Tec</span>
          </div>
          <button type="button" onClick={() => setMenuOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-input-bg text-slate-450 hover:bg-slate-550/10 transition">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 space-y-2.5">
          <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/menu') }} className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-400 hover:bg-emerald-500/5 hover:text-emerald-500 transition">
            <House className="h-5 w-5" /> Inicio
          </button>
          <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className="flex w-full items-center gap-3.5 rounded-2xl bg-emerald-500/10 px-4 py-3.5 text-sm font-bold text-emerald-450 transition">
            <UtensilsCrossed className="h-5 w-5" /> Mi Plan
          </button>
          <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/recipes') }} className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-400 hover:bg-emerald-500/5 hover:text-emerald-500 transition">
            <ChefHat className="h-5 w-5" /> Recetas
          </button>
          <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/chat') }} className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-400 hover:bg-emerald-500/5 hover:text-emerald-500 transition">
            <MessageSquareText className="h-5 w-5" /> Soporte
          </button>

          <div className="pt-6 border-t border-card-border">
            <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-500/5 transition">
              <LogOut className="h-5 w-5" /> Cerrar sesión
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Welcome banner */}
      <div className="mx-auto max-w-[1200px] px-4 pt-8">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-10 border border-slate-800 text-white shadow-xl">
          <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                Plan Activo
              </span>
              <h1 className="text-3xl font-black tracking-tight uppercase sm:text-4xl text-slate-100">Plan Nutricional del Paciente</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400">Revisa tu cronograma de alimentación diario, rutinas físicas sugeridas por tu nutricionista y logros desbloqueados.</p>
            </div>
            {activePlan && (
              <button onClick={() => navigate('/patient/plans')} className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-500 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
                Cambiar de Plan
              </button>
            )}
          </div>
        </section>
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
            {debugInfo && (
              <div className="text-[11px] font-mono text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 max-w-lg mt-4 text-left leading-relaxed">
                <strong>Debug Info:</strong> {debugInfo}
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-[2.5rem] border border-card-border bg-card-bg p-6 sm:p-8 backdrop-blur-xl shadow-sm space-y-8 transition-all duration-300">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Plan en curso</span>
                <h2 className="text-2xl font-bold text-text-main leading-tight">{activePlan.name}</h2>
                <p className="mt-2.5 text-sm text-slate-400">Control de metas de salud supervisado por: <span className="font-bold text-emerald-500">{activePlan.nutricionista}</span>.</p>
              </div>

              {/* Status metrics grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Plan</span>
                  <div className="mt-1 font-bold text-text-main text-sm">{activePlan.name}</div>
                </div>
                <div className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Calorías</span>
                  <div className="mt-1 font-bold text-text-main text-sm">{activePlan.calories}</div>
                </div>
                <div className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Duración</span>
                  <div className="mt-1 font-bold text-emerald-455 text-sm">{activePlan.week}</div>
                </div>
                <div className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 transition-colors duration-300">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Agua</span>
                  <div className="mt-1 font-bold text-sky-400 text-sm">{activePlan.hydration}</div>
                </div>
              </div>
            </div>

            {/* Adherence progress bar */}
            <div className="rounded-2xl border border-card-border bg-input-bg p-4 space-y-2 transition-all duration-300">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                <span className="text-slate-450">Adherencia del Plan actual</span>
                <span>{activePlan.progress}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-card-bg border border-card-border p-0.5 transition-all duration-300">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${activePlan.progress}%` }} />
              </div>
            </div>

            {/* Next Consultation banner */}
            <div className="flex flex-col gap-4 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500"><CalendarDays className="h-5 w-5" /></div>
                <div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Próxima Consulta Programada</span>
                  <h3 className="font-bold text-text-main text-xs leading-snug">{activePlan.nextConsult}</h3>
                </div>
              </div>
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
                      {foods.length > 0 ? (
                        foods.map((food) => (
                          <article key={food.id} className="flex items-center gap-4 rounded-2xl border border-card-border bg-card-bg p-4 hover:border-emerald-500/40 transition duration-300">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><UtensilsCrossed className="h-5 w-5" /></div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate font-bold text-sm text-text-main uppercase">{food.name || 'Alimento'}</h3>
                                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-655" />
                                <span className="text-xs text-slate-500">{food.meal_type || 'Momento'}</span>
                              </div>
                              <p className="mt-1 text-xs text-slate-400 leading-normal">{food.description || 'Sin descripción'}</p>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-500">{food.portion_grams || 0} g</span>
                          </article>
                        ))
                      ) : (
                        fallbackMealPlan.map((item) => (
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
                        ))
                      )}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'rutina' ? (
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-500">Rutina Semanal de Recomposición</h2>
                    <div className="space-y-3">
                      {fallbackRoutineDays.map((item) => (
                        <article key={item.day} className="flex items-center justify-between rounded-2xl border border-card-border bg-card-bg p-4">
                          <div className="flex items-center gap-3">
                            <span className={`h-2.5 w-2.5 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                            <div>
                              <h3 className="font-bold text-sm text-text-main">{item.day}</h3>
                              <p className="text-xs text-slate-400">{item.activity}</p>
                            </div>
                          </div>
                          <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${item.completed ? 'bg-emerald-500/15 text-emerald-450' : 'bg-slate-500/15 text-slate-450'}`}>
                            {item.completed ? 'Completado' : 'Pendiente'}
                          </span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'logros' ? (
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-500">Medallas y Logros unlocked</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {fallbackAchievements.map((item) => (
                        <article key={item.title} className="flex items-center gap-4 rounded-2xl border border-card-border bg-card-bg p-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"><Star className="h-5 w-5" /></div>
                          <div>
                            <h3 className="font-bold text-xs text-text-main uppercase tracking-wide">{item.title}</h3>
                            <p className="mt-0.5 text-xs font-semibold text-amber-500">{item.points}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <aside className="space-y-6">
                <article className="rounded-3xl border border-card-border bg-input-bg p-5 space-y-3 transition-all duration-300">
                  <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resumen Semanal</h2>
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center justify-between rounded-xl bg-card-bg px-3 py-2.5 transition-colors duration-300"><span>Calorías diarias</span><span className="font-bold text-text-main">{activePlan.calories}</span></div>
                    <div className="flex items-center justify-between rounded-xl bg-card-bg px-3 py-2.5 transition-colors duration-300"><span>Comidas del día</span><span className="font-bold text-text-main">{foods.length || 4} programadas</span></div>
                    <div className="flex items-center justify-between rounded-xl bg-card-bg px-3 py-2.5 transition-colors duration-300"><span>Hidratación</span><span className="font-bold text-text-main">{activePlan.hydration}</span></div>
                  </div>
                </article>
              </aside>
            </div>
          </section>
        )}
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