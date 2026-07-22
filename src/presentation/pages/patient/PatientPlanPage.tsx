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
      
      // Fallback 2: Check localStorage for activated plan ID
      if (!activePlanId) {
        const savedPlanId = localStorage.getItem('dietetic_active_plan_id')
        if (savedPlanId) {
          activePlanId = Number(savedPlanId)
        }
      }

      // Fallback 3: If still no active plan ID, fetch all plans from backend and select the first available plan
      if (!activePlanId) {
        const allPlansResponse = await fetch(`${API_CONFIG.BASE_URL}/planes/?page_size=100`, { headers })
        if (allPlansResponse.ok) {
          const allPlansData = await allPlansResponse.json()
          const allPlansList = Array.isArray(allPlansData.results) ? allPlansData.results : Array.isArray(allPlansData) ? allPlansData : []
          if (allPlansList.length > 0) {
            activePlanId = allPlansList[0].id
          }
        }
      }
      
      if (activePlanId) {
        // 2. Fetch plan details and foods in parallel
        const [planResponse, foodsResponse] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}/planes/${activePlanId}/`, { headers }),
          fetch(`${API_CONFIG.BASE_URL}/planes/${activePlanId}/alimentos/`, { headers })
        ])
        
        if (planResponse.ok) {
          const planDetails = await planResponse.json()
          const planName = localStorage.getItem('dietetic_active_plan_name') || planDetails.name || planDetails.nombre || 'Plan Nutricional'
          setActivePlan({
            id: planDetails.id,
            name: planName,
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
          return
        }
      }
      
      setActivePlan(null)
      setFoods([])
    } catch (error: any) {
      console.error('Error loading active diet plan:', error)
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
    <main className={`min-h-screen pb-28 relative overflow-hidden transition-colors duration-300 selection:bg-orange-500 selection:text-white ${
      isDark 
        ? "bg-[#070b10] text-slate-100 font-mono crt-scanlines" 
        : "bg-[#f3f4f6] text-slate-900 font-sans"
    }`}>
      {/* Ambient glowing circles */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />

      {/* Floating VHS Tape Horizontal Tracking Line Glitch */}
      {isDark && <div className="vhs-tracking-line" />}

      {/* Header */}
      <header className={`sticky top-0 z-30 px-4 py-4 backdrop-blur-md transition-colors duration-300 ${
        isDark ? "bg-[#070b10]/80" : "bg-[#f3f4f6]/80"
      }`}>
        <div className={`mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-2xl transition-all duration-300 ${
          isDark 
            ? "bg-[#384349] px-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] border border-[#242d32]" 
            : "bg-white px-6 shadow-sm border border-slate-200"
        }`}>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              isDark 
                ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400" 
                : "border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className={`flex items-center gap-2 text-xl font-black tracking-[0.2em] uppercase transition-colors duration-300 ${
            isDark ? "text-slate-100 vhs-text-glitch" : "text-slate-900"
          }`} style={isDark ? { filter: 'drop-shadow(0 0 6px #38bdf8)' } : {}}>
            NUTRI<span className={isDark ? "text-cyan-400" : "text-emerald-500"}>TEC</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-slate-400">
            <button onClick={() => navigate('/patient/menu')} className={`hover:${isDark ? "text-cyan-400" : "text-emerald-500"} transition`}>Inicio</button>
            <button onClick={() => navigate('/patient/plan')} className={`${isDark ? "text-cyan-400 font-extrabold" : "text-emerald-500 font-bold"} transition`}>Mi Plan</button>
            <button onClick={() => navigate('/patient/recipes')} className={`hover:${isDark ? "text-cyan-400" : "text-emerald-500"} transition`}>Recetas</button>
            <button onClick={() => navigate('/patient/chat')} className={`hover:${isDark ? "text-cyan-400" : "text-emerald-500"} transition`}>Chat</button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isDark 
                  ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-500/10" 
                  : "border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
              title="Alternar modo claro/oscuro"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-500" />}
            </button>

            <button className={`overflow-hidden flex h-10 w-10 items-center justify-center rounded-xl transition ${
              isDark 
                ? "border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]" 
                : "border border-slate-200 bg-slate-50 text-slate-500"
            } text-xs font-black`}>
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
      <div className={`fixed inset-0 z-50 transition ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <button type="button" aria-label="Cerrar menú" className={`absolute inset-0 bg-slate-950/60 backdrop-blur-[3px] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 flex h-full w-[min(86vw,420px)] flex-col overflow-hidden shadow-[24px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} ${
          isDark ? "bg-[#384349] border-r border-[#242d32]" : "bg-white border-r border-slate-200"
        }`}>
          <div className={`relative flex min-h-[260px] flex-col justify-between px-6 pb-8 pt-7 text-white ${
            isDark ? "bg-gradient-to-b from-[#242d32] to-[#1e2528]" : "bg-gradient-to-b from-emerald-950 to-slate-900"
          }`}>
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition hover:bg-white/10">
              <PanelLeftClose className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-start gap-5">
              <div className="overflow-hidden flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-cyan-400 shadow-[0_10px_25px_rgba(56,189,248,0.2)]">
                {avatarUrlResolved ? (
                  <img src={avatarUrlResolved} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UtensilsCrossed className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider">{user?.username}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">{user?.role}</p>
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-2.5 p-6">
            <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/menu') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
              isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-500"
            }`}>
              <House className="h-5 w-5" /> Inicio
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
              isDark ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20" : "bg-emerald-500/10 text-emerald-600"
            }`}>
              <UtensilsCrossed className="h-5 w-5" /> Mi Plan
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/recipes') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
              isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-500"
            }`}>
              <ChefHat className="h-5 w-5" /> Recetas
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/chat') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
              isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-500"
            }`}>
              <MessageSquareText className="h-5 w-5" /> Soporte
            </button>

            <div className="pt-6 border-t border-card-border">
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 transition">
                <LogOut className="h-5 w-5" /> Cerrar sesión
              </button>
            </div>
          </nav>
        </aside>
      </div>

      {/* Hero Welcome banner */}
      <div className="mx-auto max-w-[1200px] px-4 pt-8">
        <section className={`relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 border transition-all duration-300 ${
          isDark 
            ? "bg-[#384349] border-4 border-[#242d32] shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] text-slate-100" 
            : "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-white"
        }`}>
          <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                isDark 
                  ? "bg-cyan-400/10 text-cyan-450 border-cyan-400/25" 
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Plan Activo
              </span>
              <h1 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">Plan Nutricional del Paciente</h1>
              <p className="max-w-2xl text-xs leading-relaxed text-slate-300 uppercase tracking-wide font-bold">Revisa tu cronograma de alimentación diario, rutinas físicas sugeridas por tu nutricionista y logros desbloqueados.</p>
            </div>
            {activePlan && (
              <button 
                onClick={() => navigate('/patient/plans')} 
                className={`inline-flex items-center gap-2 self-start rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-widest transition shadow-lg ${
                  isDark 
                    ? "bg-[#ff5500] hover:bg-[#e04b00] border border-orange-400 text-white btn-pixel-retro" 
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                }`}
              >
                Cambiar de Plan
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1200px] px-4 pt-8 space-y-8">
        {loading ? (
          <div className={`flex flex-col items-center justify-center py-32 rounded-3xl border transition-all duration-300 ${
            isDark ? "bg-[#384349] border-4 border-[#242d32]" : "bg-card-bg/40 border-card-border"
          }`}>
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
            <p className="mt-4 text-slate-300 font-bold uppercase tracking-widest text-xs">Cargando tu plan nutricional...</p>
          </div>
        ) : !activePlan ? (
          <section className={`rounded-[2rem] p-6 sm:p-10 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px] border transition-all duration-300 ${
            isDark 
              ? "bg-[#384349] border-4 border-[#242d32] shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] text-slate-100" 
              : "bg-card-bg border-card-border"
          }`}>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <UtensilsCrossed className="h-10 w-10 animate-bounce" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold uppercase tracking-wider">No tienes un plan activo</h2>
              <p className="text-slate-300 text-xs leading-relaxed font-bold uppercase">
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
          <section className={`rounded-[2.5rem] border p-6 sm:p-8 shadow-sm space-y-8 transition-all duration-300 ${
            isDark 
              ? "bg-[#384349] border-4 border-[#242d32] shadow-[inset_0_0_40px_rgba(0,0,0,0.7)] text-slate-100" 
              : "bg-white border-slate-200"
          }`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-cyan-400" : "text-emerald-500"}`}>[PLAN DE NUTRICIÓN EN CURSO]</span>
                <h2 className="text-2xl font-black uppercase tracking-wider text-white mt-1">{activePlan.name}</h2>
                <p className="mt-2.5 text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Control de metas de salud supervisado por: <span className={`font-extrabold ${isDark ? "text-cyan-400" : "text-emerald-500"}`}>{activePlan.nutricionista}</span>.
                </p>
              </div>

              {/* Status metrics grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className={`rounded-2xl border px-4 py-3 transition-colors duration-300 ${
                  isDark ? "bg-[#242d32] border-[#242d32]" : "bg-input-bg border-card-border"
                }`}>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Plan</span>
                  <div className="mt-1 font-black text-sm uppercase">{activePlan.name}</div>
                </div>
                <div className={`rounded-2xl border px-4 py-3 transition-colors duration-300 ${
                  isDark ? "bg-[#242d32] border-[#242d32]" : "bg-input-bg border-card-border"
                }`}>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Calorías</span>
                  <div className="mt-1 font-black text-sm uppercase">{activePlan.calories}</div>
                </div>
                <div className={`rounded-2xl border px-4 py-3 transition-colors duration-300 ${
                  isDark ? "bg-[#242d32] border-[#242d32]" : "bg-input-bg border-card-border"
                }`}>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Duración</span>
                  <div className={`mt-1 font-black text-sm uppercase ${isDark ? "text-cyan-400" : "text-emerald-500"}`}>{activePlan.week}</div>
                </div>
                <div className={`rounded-2xl border px-4 py-3 transition-colors duration-300 ${
                  isDark ? "bg-[#242d32] border-[#242d32]" : "bg-input-bg border-card-border"
                }`}>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Agua</span>
                  <div className="mt-1 font-black text-sky-400 text-sm uppercase">{activePlan.hydration}</div>
                </div>
              </div>
            </div>

            {/* Adherence progress bar */}
            <div className={`rounded-2xl border p-4 space-y-2 transition-all duration-300 ${
              isDark ? "bg-[#242d32] border-[#242d32]" : "bg-input-bg border-card-border"
            }`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                <span className="text-slate-350">Adherencia del Plan actual</span>
                <span>{activePlan.progress}%</span>
              </div>
              <div className={`h-3 w-full rounded-full p-0.5 transition-all duration-300 ${
                isDark ? "bg-slate-950 border border-white/5" : "bg-card-bg border border-card-border"
              }`}>
                <div className={`h-full rounded-full ${
                  isDark ? "bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]" : "bg-gradient-to-r from-emerald-500 to-teal-400"
                }`} style={{ width: `${activePlan.progress}%` }} />
              </div>
            </div>

            {/* Next Consultation banner */}
            <div className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
              isDark ? "bg-[#242d32] border-[#242d32]" : "bg-emerald-500/5 border-emerald-500/10"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-500"
                }`}><CalendarDays className="h-5 w-5" /></div>
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-cyan-455" : "text-emerald-450"}`}>Próxima Consulta Programada</span>
                  <h3 className="font-bold text-xs leading-snug uppercase mt-0.5">{activePlan.nextConsult}</h3>
                </div>
              </div>
            </div>

            {/* Interactive Custom Tabs */}
            <div className={`flex gap-2 border-b pb-3 overflow-x-auto ${isDark ? "border-[#242d32]" : "border-card-border"}`}>
              {planTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button 
                    key={tab.id} 
                    type="button" 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
                      isActive 
                        ? (isDark ? 'bg-[#ff5500] text-white border border-orange-400 btn-pixel-retro shadow-lg' : 'bg-emerald-500 text-slate-950 shadow-md')
                        : (isDark ? 'border border-[#242d32] bg-[#242d32] text-slate-300 hover:text-cyan-400' : 'border border-card-border bg-input-bg text-slate-500 hover:text-emerald-500')
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <section className={`rounded-3xl border p-5 sm:p-6 shadow-inner transition-all duration-300 ${
                isDark ? "bg-[#242d32] border-[#242d32]" : "bg-input-bg border-card-border"
              }`}>
                {activeTab === 'dieta' ? (
                  <div className="space-y-4">
                    <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-emerald-500"}`}>{isDark ? "[MENÚ RECOMENDADO DIETA]" : "Menú Recomendado por Nutricionista"}</h2>
                    <div className="space-y-3">
                      {foods.length > 0 ? (
                        foods.map((food) => (
                          <article key={food.id} className={`flex items-center gap-4 rounded-xl border p-4 transition duration-300 ${
                            isDark ? "bg-[#384349] border-[#242d32] hover:border-cyan-400" : "bg-card-bg border-card-border hover:border-emerald-500/40"
                          }`}>
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-500"}`}><UtensilsCrossed className="h-5 w-5" /></div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate font-black text-sm text-white uppercase">{food.name || 'Alimento'}</h3>
                                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-655" />
                                <span className="text-xs text-slate-400 uppercase font-bold">{food.meal_type || 'Momento'}</span>
                              </div>
                              <p className="mt-1 text-xs text-slate-300 leading-normal uppercase font-bold">{food.description || 'Sin descripción'}</p>
                            </div>
                            <span className={`rounded-xl border px-3 py-1 text-[10px] font-black uppercase ${
                              isDark ? "bg-cyan-400/10 border-cyan-400/20 text-cyan-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            }`}>{food.portion_grams || 0} g</span>
                          </article>
                        ))
                      ) : (
                        fallbackMealPlan.map((item) => (
                          <article key={item.title} className={`flex items-center gap-4 rounded-xl border p-4 transition duration-300 ${
                            isDark ? "bg-[#384349] border-[#242d32] hover:border-cyan-400" : "bg-card-bg border-card-border hover:border-emerald-500/40"
                          }`}>
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-500"}`}><UtensilsCrossed className="h-5 w-5" /></div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate font-black text-sm text-white uppercase">{item.title}</h3>
                                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-655" />
                                <span className="text-xs text-slate-400 uppercase font-bold">{item.time}</span>
                              </div>
                              <p className="mt-1 text-xs text-slate-350 leading-normal uppercase font-bold">{item.detail}</p>
                            </div>
                            <span className={`rounded-xl border px-3 py-1 text-[10px] font-black uppercase ${
                              isDark ? "bg-cyan-400/10 border-cyan-400/20 text-cyan-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            }`}>{item.status}</span>
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'rutina' ? (
                  <div className="space-y-4">
                    <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-emerald-500"}`}>{isDark ? "[RUTINA SEMANAL ACTIVIDAD]" : "Rutina Semanal de Recomposición"}</h2>
                    <div className="space-y-3">
                      {fallbackRoutineDays.map((item) => (
                        <article key={item.day} className={`flex items-center justify-between rounded-xl border p-4 ${
                          isDark ? "bg-[#384349] border-[#242d32]" : "bg-card-bg border-card-border"
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className={`h-2.5 w-2.5 rounded-full ${item.completed ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                            <div>
                              <h3 className="font-black text-sm text-white uppercase tracking-wider">{item.day}</h3>
                              <p className="text-xs text-slate-300 uppercase font-bold">{item.activity}</p>
                            </div>
                          </div>
                          <span className={`rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                            item.completed 
                              ? (isDark ? 'bg-cyan-400/15 text-cyan-400' : 'bg-emerald-500/15 text-emerald-600') 
                              : 'bg-slate-500/15 text-slate-400'
                          }`}>
                            {item.completed ? 'Completado' : 'Pendiente'}
                          </span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'logros' ? (
                  <div className="space-y-4">
                    <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-emerald-500"}`}>{isDark ? "[LOGROS Y MEDALLAS DECK]" : "Medallas y Logros unlocked"}</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {fallbackAchievements.map((item) => (
                        <article key={item.title} className={`flex items-center gap-4 rounded-xl border p-4 ${
                          isDark ? "bg-[#384349] border-[#242d32]" : "bg-card-bg border-card-border"
                        }`}>
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isDark ? "bg-amber-400/10 text-amber-400" : "bg-amber-500/10 text-amber-500"}`}><Star className="h-5 w-5" /></div>
                          <div>
                            <h3 className="font-black text-xs text-white uppercase tracking-wider">{item.title}</h3>
                            <p className="mt-0.5 text-xs font-black text-amber-400 uppercase tracking-widest">{item.points}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <aside className="space-y-6">
                <article className={`rounded-3xl border p-5 space-y-3 transition-all duration-300 ${
                  isDark ? "bg-[#242d32] border-[#242d32] shadow-inner" : "bg-input-bg border-card-border"
                }`}>
                  <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">[RESUMEN SEMANAL]</h2>
                  <div className="space-y-2 text-xs text-slate-400 uppercase font-bold">
                    <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-300 ${
                      isDark ? "bg-[#384349]" : "bg-card-bg"
                    }`}><span>Calorías diarias</span><span className="font-black text-white">{activePlan.calories}</span></div>
                    <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-300 ${
                      isDark ? "bg-[#384349]" : "bg-card-bg"
                    }`}><span>Comidas del día</span><span className="font-black text-white">{foods.length || 4} programadas</span></div>
                    <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-300 ${
                      isDark ? "bg-[#384349]" : "bg-card-bg"
                    }`}><span>Hidratación</span><span className="font-black text-white">{activePlan.hydration}</span></div>
                  </div>
                </article>
              </aside>
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className={`fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-2xl border shadow-2xl p-2.5 md:hidden transition-all duration-300 ${
        isDark ? "border-4 border-[#242d32] bg-[#384349]/95" : "border-card-border bg-card-bg/95 backdrop-blur-xl"
      }`}>
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
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition ${
                active 
                  ? (isDark ? 'text-cyan-400 bg-cyan-400/10' : 'text-emerald-500 bg-emerald-500/5') 
                  : (isDark ? 'text-slate-350 hover:text-cyan-400' : 'text-slate-500 hover:text-emerald-500')
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  )
}