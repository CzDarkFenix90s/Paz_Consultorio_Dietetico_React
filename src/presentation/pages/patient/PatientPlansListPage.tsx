// src/presentation/pages/patient/PatientPlansListPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Filter, 
  LoaderCircle, 
  Search, 
  ShieldPlus, 
  UtensilsCrossed, 
  XCircle,
  Sun,
  Moon
} from 'lucide-react'

type PlanItem = {
  id: number
  name: string
  description: string
  goal: string
  target_calories: number
  duration_weeks: number
  estimated_cost: string
  is_active: boolean
  total_alimentos: number
  created_at: string
}

type PlansResponse = {
  results?: PlanItem[]
}

type PlanFilter = 'all' | 'active' | 'inactive'

const fallbackPlans: PlanItem[] = [
  {
    id: 99,
    name: 'Plan de Pérdida de Peso Demo',
    description: 'Diseñado para reducción de peso con comidas balanceadas y control de energía.',
    goal: 'Pérdida de peso',
    target_calories: 1600,
    duration_weeks: 12,
    estimated_cost: '310.00',
    is_active: false,
    total_alimentos: 18,
    created_at: new Date().toISOString(),
  },
]

function formatDate(dateValue: string) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

export default function PatientPlansListPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all')
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)

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

  useEffect(() => {
    let ignore = false

    async function loadPlans() {
      try {
        setLoading(true)
        setErrorMessage('')

        const token = localStorage.getItem('dietetic_access_token')
        const response = await fetch(`${API_CONFIG.BASE_URL}/planes/?page_size=100`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = (await response.json()) as PlansResponse
        const results = Array.isArray(data.results) ? data.results : []

        if (!ignore) {
          setPlans(results.length > 0 ? results : fallbackPlans)
        }
      } catch {
        if (!ignore) {
          setPlans(fallbackPlans)
          setErrorMessage('No se pudo leer el backend. Se muestran planes de ejemplo mientras tanto.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadPlans()

    return () => {
      ignore = true
    }
  }, [])

  const visiblePlans = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return plans.filter((plan) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        plan.name.toLowerCase().includes(normalizedSearch) ||
        plan.goal.toLowerCase().includes(normalizedSearch) ||
        plan.description.toLowerCase().includes(normalizedSearch)

      const matchesFilter =
        planFilter === 'all' ||
        (planFilter === 'active' && plan.is_active) ||
        (planFilter === 'inactive' && !plan.is_active)

      return matchesSearch && matchesFilter
    })
  }, [plans, search, planFilter])

  const totals = useMemo(
    () => ({
      all: plans.length,
      active: plans.filter((plan) => plan.is_active).length,
      inactive: plans.filter((plan) => !plan.is_active).length,
    }),
    [plans],
  )

  const selectedPlan = visiblePlans.find((plan) => plan.id === selectedPlanId) ?? visiblePlans[0] ?? null

  return (
    <main className="min-h-screen bg-bg-main text-text-main transition-colors duration-300 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-card-border bg-header-bg backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate('/patient/plan')} className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-input-bg text-slate-400 transition hover:bg-slate-500/10">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-bold text-text-main uppercase">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldPlus className="h-5 w-5" />
            </span>
            Planes disponibles
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-400">
            <button onClick={() => navigate('/patient/menu')} className="hover:text-emerald-500 transition">Inicio</button>
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
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-card-bg border border-card-border p-4 shadow-sm sm:p-6 lg:p-8 transition-all duration-300">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">Catálogo desde backend</p>
              <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Selecciona el plan que quieres seguir</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-400">Esta vista consulta los planes existentes en el backend y te deja filtrarlos, buscarlos y ver su detalle antes de elegir uno.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 transition-colors duration-300">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-550">Total</div>
                <div className="mt-1 text-2xl font-black text-text-main">{totals.all}</div>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Activos</div>
                <div className="mt-1 text-2xl font-black text-emerald-450">{totals.active}</div>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Inactivos</div>
                <div className="mt-1 text-2xl font-black text-amber-500">{totals.inactive}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-3 rounded-2xl border border-card-border bg-input-bg px-4 py-3 transition-colors duration-300">
              <Search className="h-5 w-5 text-slate-500" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, objetivo o descripción" className="w-full bg-transparent text-sm text-text-main outline-none placeholder:text-slate-500" />
            </label>

            <div className="flex items-center gap-2 rounded-2xl border border-card-border bg-input-bg p-1 transition-colors duration-300">
              {([
                { id: 'all', label: 'Todos', icon: Filter },
                { id: 'active', label: 'Activos', icon: CheckCircle2 },
                { id: 'inactive', label: 'Inactivos', icon: XCircle },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setPlanFilter(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${planFilter === id ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10' : 'text-slate-400 hover:text-emerald-500'}`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-card-border bg-input-bg/50 text-slate-400">
              <LoaderCircle className="h-6 w-6 animate-spin text-emerald-500" />
              <span className="ml-3 font-semibold">Cargando planes desde el backend...</span>
            </div>
          ) : null}

          {!loading ? (
            <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="space-y-4">
                {visiblePlans.map((plan) => {
                  const active = selectedPlan?.id === plan.id

                  return (
                    <article key={plan.id} className={`cursor-pointer rounded-[1.75rem] border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${active ? 'border-emerald-500 bg-emerald-500/5' : 'border-card-border bg-card-bg'}`} onClick={() => setSelectedPlanId(plan.id)}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${plan.is_active ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-input-bg border border-card-border text-slate-500'}`}>
                            <UtensilsCrossed className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-xl font-bold text-text-main uppercase tracking-tight">{plan.name}</h2>
                              <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${plan.is_active ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450' : 'bg-slate-500/10 border border-card-border text-slate-500'}`}>{plan.is_active ? 'Activo' : 'Inactivo'}</span>
                            </div>
                            <p className="mt-2 max-w-3xl text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase">
                              <span className="rounded-full bg-input-bg border border-card-border text-slate-400 px-3 py-1">Objetivo: {plan.goal}</span>
                              <span className="rounded-full bg-input-bg border border-card-border text-slate-400 px-3 py-1">{plan.duration_weeks} semanas</span>
                              <span className="rounded-full bg-input-bg border border-card-border text-slate-400 px-3 py-1">{plan.total_alimentos} alimentos</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            navigate(`/patient/plans/${plan.id}`)
                          }}
                          className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-500 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
                        >
                          Ver plan <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-input-bg border border-card-border px-4 py-3 transition-colors duration-300">
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Calorías</div>
                          <div className="mt-1 text-lg font-black text-text-main">{plan.target_calories} kcal</div>
                        </div>
                        <div className="rounded-2xl bg-input-bg border border-card-border px-4 py-3 transition-colors duration-300">
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Creado</div>
                          <div className="mt-1 text-xs font-bold text-text-main">{formatDate(plan.created_at)}</div>
                        </div>
                      </div>
                    </article>
                  )
                })}

                {visiblePlans.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-card-border bg-input-bg/50 p-8 text-center text-slate-500">No se encontraron planes con esos filtros.</div>
                ) : null}

                {errorMessage ? (
                  <div className="rounded-[1.75rem] border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-xs text-amber-300">{errorMessage}</div>
                ) : null}
              </section>

              <aside className="space-y-6">
                <article className="rounded-[1.75rem] bg-emerald-500 p-5 text-slate-950 shadow-lg shadow-emerald-500/15 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                      <UtensilsCrossed className="h-6 w-6 text-slate-950" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-900 uppercase">Plan seleccionado</p>
                      <h2 className="text-xl font-black uppercase tracking-tight">{selectedPlan?.name ?? 'Ninguno'}</h2>
                    </div>
                  </div>

                  {selectedPlan ? (
                    <div className="space-y-4 text-xs text-slate-900 font-semibold">
                      <p className="leading-relaxed">{selectedPlan.description}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900/70">Objetivo</div>
                          <div className="mt-1 font-bold truncate">{selectedPlan.goal}</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900/70">Alimentos</div>
                          <div className="mt-1 font-bold">{selectedPlan.total_alimentos}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              </aside>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}