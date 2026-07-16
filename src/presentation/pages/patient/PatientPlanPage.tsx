// src/presentation/pages/patient/PatientPlanPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  ArrowRight, 
  CalendarDays, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Medal, 
  Menu, 
  PanelLeftClose, 
  ShieldPlus, 
  Sparkles, 
  Star, 
  Target, 
  UtensilsCrossed, 
  UserCircle2,
  LogOut,
  Camera,
  MessageSquareText,
  House
} from 'lucide-react'

type PlanTab = 'dieta' | 'rutina' | 'logros'

const planTabs: Array<{ id: PlanTab; label: string; icon: any }> = [
  { id: 'dieta', label: 'Dieta recomendada', icon: UtensilsCrossed },
  { id: 'rutina', label: 'Rutina asociada', icon: CalendarDays },
  { id: 'logros', label: 'Logros desbloqueados', icon: Medal },
]

const fallbackMealPlan = [
  { title: 'Desayuno', time: '08:00 AM', detail: 'Avena con fresas, chía y yogur griego sin azúcar', status: 'Completado' },
  { title: 'Media mañana', time: '10:30 AM', detail: 'Una manzana verde + 10 almendras tostadas', status: 'Pendiente' },
  { title: 'Almuerzo', time: '13:30 PM', detail: 'Pechuga a la plancha con ensalada verde y quinua', status: 'Programado' },
  { title: 'Cena', time: '19:30 PM', detail: 'Sopa de verduras + filete de pescado ligero', status: 'Programado' },
]

const fallbackRoutineDays = [
  { day: 'Lunes', activity: 'Caminar 35 min ritmo activo', completed: true },
  { day: 'Miércoles', activity: 'Rutina de fuerza del tren superior suave', completed: false },
  { day: 'Viernes', activity: 'Cardio suave + estiramiento', completed: false },
]

const fallbackAchievements = [
  { title: '7 días sin saltar comidas', points: '+50 pts' },
  { title: 'Meta de agua 5/7 días', points: '+30 pts' },
  { title: 'Primera consulta completada', points: '+100 pts' },
]

const bottomNav = [
  { label: 'Inicio', icon: House, active: false },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: true },
  { label: 'Progreso', icon: Camera, active: false },
  { label: 'Chat', icon: MessageSquareText, active: false },
]

export default function PatientPlanPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<PlanTab>('dieta')
  
  const [activePlan, setActivePlan] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadActivePlan() {
      try {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('dietetic_access_token')
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/consultas/mine/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('No se pudieron obtener las consultas del paciente.')
        }
        
        const data = await response.json()
        const results = data.results || data
        
        if (results && results.length > 0) {
          const activeConsult = results[0]
          if (activeConsult.plan_nutricional) {
            setActivePlan({
              name: activeConsult.plan_nutricional.name,
              description: activeConsult.plan_nutricional.description,
              calories: `${activeConsult.plan_nutricional.target_calories} kcal`,
              week: `Semana 1 de ${activeConsult.plan_nutricional.duration_weeks || 4}`,
              progress: 45,
              hydration: '1.2 L / 2.0 L',
              nextConsult: activeConsult.scheduled_time 
                ? new Date(activeConsult.scheduled_time).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'No programada',
              nutricionista: activeConsult.nutricionista 
                ? `${activeConsult.nutricionista.first_name} ${activeConsult.nutricionista.last_name}` 
                : 'Nutricionista de turno'
            })
          }
        }
      } catch {
        setError('No se pudo conectar al servidor local.')
      } finally {
        setLoading(false)
      }
    }

    loadActivePlan()
  }, [])

  // Offline bypass fallback
  const handleOfflinePlanBypass = () => {
    setActivePlan({
      name: 'Plan Balance Saludable',
      description: 'Plan general enfocado en control de porciones y comidas balanceadas.',
      calories: '1850 kcal',
      week: 'Semana 2 de 8',
      progress: 60,
      hydration: '1.2 L / 2.0 L',
      nextConsult: 'Lunes, 24 de Julio - 10:00 AM',
      nutricionista: 'Dra. Maria Cosio'
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Ambient glowing circles */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
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
            Mi Plan
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-700 shadow-sm">
            {initialLetter}
          </button>
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
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <House className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Inicio</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className="flex w-full items-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 text-left text-sm font-bold text-emerald-400">
                <UtensilsCrossed className="h-5 w-5 shrink-0 text-white" />
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

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1200px] px-4 pt-8 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-2xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-semibold">Cargando tu plan nutricional...</p>
          </div>
        ) : !activePlan ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <UtensilsCrossed className="h-10 w-10 animate-bounce" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold text-white">No tienes un plan activo</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Parece que aún no tienes asignado ningún plan de alimentación en el consultorio. ¡Adquiere uno del catálogo o activa el plan demo offline!
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate('/patient/plans')}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:brightness-110 transition shadow-md shadow-emerald-500/15"
              >
                Ver Catálogo de Planes
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={handleOfflinePlanBypass}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Activar Plan Demo Offline
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Plan Nutricional Activo</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Dieta, Nutrición y Progreso</h1>
                <p className="mt-2.5 text-sm text-slate-400">Control de metas de salud supervisado por: <span className="font-bold text-emerald-400">{activePlan.nutricionista}</span>.</p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4.5 py-2.5 text-sm font-bold text-emerald-400 shadow-sm shadow-emerald-500/5">
                <Sparkles className="h-4.5 w-4.5 animate-spin" />
                Seguimiento Médico Activo
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/40 to-slate-900/40 p-6 shadow-md md:col-span-2 space-y-5 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-md">
                    <Target className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider">Plan Asignado</p>
                    <h2 className="text-xl font-bold text-white leading-tight">{activePlan.name}</h2>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-3 text-center">
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 py-2.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Calorías</p>
                    <div className="mt-1 font-bold text-white text-sm">{activePlan.calories}</div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 py-2.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Estado</p>
                    <div className="mt-1 font-bold text-emerald-400 text-sm">{activePlan.week}</div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 py-2.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Hidratación</p>
                    <div className="mt-1 font-bold text-sky-400 text-sm">{activePlan.hydration}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Adherencia General</span>
                    <span>{activePlan.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${activePlan.progress}%` }} />
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-white/5 bg-slate-950/40 p-5 space-y-2 flex flex-col justify-between shadow-inner">
                <div>
                  <p className="text-xs font-bold text-slate-500">PRÓXIMO CONTROL</p>
                  <div className="mt-3 flex items-start gap-2.5">
                    <CalendarDays className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-white text-xs leading-snug">{activePlan.nextConsult}</h3>
                      <p className="mt-1 text-[10px] text-slate-500">Evaluación antropométrica y física.</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-white/5 bg-slate-950/40 p-5 space-y-2 flex flex-col justify-between shadow-inner">
                <div>
                  <p className="text-xs font-bold text-slate-500">LÍMITE DIARIO</p>
                  <div className="mt-3 flex items-center gap-2.5">
                    <Flame className="h-5 w-5 text-orange-400 shrink-0" />
                    <div>
                      <h3 className="font-bold text-white text-sm">{activePlan.calories}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Fraccionado en comidas.</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Interactive Custom Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-3 overflow-x-auto">
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
                        : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <section className="rounded-3xl border border-white/5 bg-slate-950/40 p-5 sm:p-6 shadow-inner">
                {activeTab === 'dieta' ? (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-white">Menú Recomendado por Nutricionista</h2>
                    <div className="space-y-3">
                      {fallbackMealPlan.map((item) => (
                        <article key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-900/30 p-4 hover:border-emerald-500/20 transition">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><UtensilsCrossed className="h-5 w-5" /></div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-bold text-sm text-white">{item.title}</h3>
                              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-700" />
                              <span className="text-xs text-slate-500">{item.time}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400 leading-normal">{item.detail}</p>
                          </div>
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400">{item.status}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'rutina' ? (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-white">Rutina Semanal de Recomposición</h2>
                    <div className="space-y-3">
                      {fallbackRoutineDays.map((item) => (
                        <article key={item.day} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/30 p-4">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                              {item.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                            </div>
                            <div><h3 className="font-bold text-sm text-white">{item.day}</h3><p className="mt-1 text-xs text-slate-400">{item.activity}</p></div>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${item.completed ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{item.completed ? 'Completado' : 'Pendiente'}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'logros' ? (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-white">Avance y Logros Desbloqueados</h2>
                    <div className="space-y-3">
                      {fallbackAchievements.map((item) => (
                        <article key={item.title} className="rounded-2xl border border-white/5 bg-slate-900/30 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><Star className="h-5 w-5" /></div>
                            <h3 className="font-bold text-xs text-white">{item.title}</h3>
                          </div>
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400">{item.points}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <aside className="space-y-6">
                <article className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950 to-slate-900 p-6 shadow-lg shadow-emerald-950/20 space-y-4">
                  <h2 className="text-lg font-bold text-white">Subir Foto de Avance</h2>
                  <p className="text-xs text-slate-300 leading-normal">
                    Registra tu evolución corporal cargando una imagen directamente al servidor local.
                  </p>
                  <button type="button" onClick={() => navigate('/patient/photos')} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-bold text-slate-950 hover:bg-slate-100 transition">Subir Foto de Progreso <ArrowRight className="h-4 w-4" /></button>
                </article>

                <article className="rounded-3xl border border-white/5 bg-slate-950/40 p-5 space-y-3">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumen Semanal</h2>
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/50 px-3 py-2.5"><span>Calorías diarias</span><span className="font-bold text-white">1,850 kcal</span></div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/50 px-3 py-2.5"><span>Comidas del día</span><span className="font-bold text-white">4 programadas</span></div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/50 px-3 py-2.5"><span>Hidratación</span><span className="font-bold text-white">1.2 / 2.0 L</span></div>
                  </div>
                </article>
              </aside>
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-2.5">
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