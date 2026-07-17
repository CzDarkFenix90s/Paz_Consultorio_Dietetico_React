import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { ArrowLeft, ArrowRight, BadgeDollarSign, CalendarDays, CheckCircle2, Filter, LoaderCircle, Search, ShieldPlus, Sparkles, UtensilsCrossed, XCircle } from 'lucide-react'

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
    id: 1,
    name: 'Plan Balance Saludable',
    description: 'Plan enfocado en educación alimentaria, control de porciones y adherencia gradual.',
    goal: 'Mejorar composición corporal',
    target_calories: 1850,
    duration_weeks: 8,
    estimated_cost: '250.00',
    is_active: true,
    total_alimentos: 24,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Plan Descenso Activo',
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

function formatPrice(value: string) {
  const number = Number(value)
  if (Number.isNaN(number)) return `S/ ${value}`
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(number)
}

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
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate('/patient/plan')} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100 transition hover:bg-emerald-100">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <ShieldPlus className="h-5 w-5" />
            </span>
            Planes disponibles
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/patient/menu')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-slate-909 transition">Inicio</button>
            <button onClick={() => navigate('/patient/plan')} className="text-sm font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-600 transition">Mi Plan</button>
            <button onClick={() => navigate('/patient/recipes')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition">Recetas</button>
            <button onClick={() => navigate('/patient/chat')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition">Chat</button>
          </nav>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-700 shadow-sm">J</button>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Catálogo desde backend</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-800">Selecciona el plan que quieres seguir</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">Esta vista consulta los planes existentes en el backend y te deja filtrarlos, buscarlos y ver su detalle antes de elegir uno.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total</div>
                <div className="mt-1 text-2xl font-semibold text-slate-800">{totals.all}</div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Activos</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-700">{totals.active}</div>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Inactivos</div>
                <div className="mt-1 text-2xl font-semibold text-amber-700">{totals.inactive}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, objetivo o descripción" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </label>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              {([
                { id: 'all', label: 'Todos', icon: Filter },
                { id: 'active', label: 'Activos', icon: CheckCircle2 },
                { id: 'inactive', label: 'Inactivos', icon: XCircle },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setPlanFilter(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${planFilter === id ? 'bg-emerald-500 text-white shadow-[0_10px_20px_rgba(34,197,94,0.16)]' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-[1.75rem] border border-slate-100 bg-slate-50/70 text-slate-500">
              <LoaderCircle className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="ml-3 font-medium">Cargando planes desde el backend...</span>
            </div>
          ) : null}

          {!loading ? (
            <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="space-y-4">
                {visiblePlans.map((plan) => {
                  const active = selectedPlan?.id === plan.id

                  return (
                    <article key={plan.id} className={`cursor-pointer rounded-[1.75rem] border p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${active ? 'border-emerald-200 bg-emerald-50/60 shadow-[0_12px_30px_rgba(34,197,94,0.08)]' : 'border-slate-100 bg-white'}`} onClick={() => setSelectedPlanId(plan.id)}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${plan.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            <UtensilsCrossed className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-xl font-semibold text-slate-800">{plan.name}</h2>
                              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${plan.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{plan.is_active ? 'Activo' : 'Inactivo'}</span>
                            </div>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{plan.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                              <span className="rounded-full bg-slate-100 px-3 py-1">Objetivo: {plan.goal}</span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">{plan.duration_weeks} semanas</span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">{plan.total_alimentos} alimentos</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            navigate(`/patient/plans/${plan.id}`)
                          }}
                          className="inline-flex items-center gap-2 self-start rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(34,197,94,0.18)] transition hover:bg-emerald-600"
                        >
                          Ver plan <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Calorías</div>
                          <div className="mt-1 text-lg font-semibold text-slate-800">{plan.target_calories} kcal</div>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Costo</div>
                          <div className="mt-1 text-lg font-semibold text-slate-800">{formatPrice(plan.estimated_cost)}</div>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Creado</div>
                          <div className="mt-1 text-sm font-semibold text-slate-800">{formatDate(plan.created_at)}</div>
                        </div>
                      </div>
                    </article>
                  )
                })}

                {visiblePlans.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-slate-500">No se encontraron planes con esos filtros.</div>
                ) : null}

                {errorMessage ? (
                  <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{errorMessage}</div>
                ) : null}
              </section>

              <aside className="space-y-6">
                <article className="rounded-[1.75rem] bg-emerald-500 p-5 text-white shadow-[0_16px_40px_rgba(34,197,94,0.22)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <BadgeDollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/85">Plan seleccionado</p>
                      <h2 className="text-2xl font-semibold">{selectedPlan?.name ?? 'Ninguno'}</h2>
                    </div>
                  </div>

                  {selectedPlan ? (
                    <div className="mt-5 space-y-3 text-sm text-white/90">
                      <p>{selectedPlan.description}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">Objetivo</div>
                          <div className="mt-1 font-semibold">{selectedPlan.goal}</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">Alimentos</div>
                          <div className="mt-1 font-semibold">{selectedPlan.total_alimentos}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>

                <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Qué trae la API</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-500">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <CalendarDays className="h-5 w-5 text-emerald-500" />
                      <span>Planes paginados desde <span className="font-semibold text-slate-700">/api/planes/</span></span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <Sparkles className="h-5 w-5 text-emerald-500" />
                      <span>Campos reales: nombre, objetivo, calorías, costo y semanas</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span>Fallback local si el backend no responde</span>
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}