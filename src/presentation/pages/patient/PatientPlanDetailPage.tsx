import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, LoaderCircle, ShieldPlus, Sparkles, UtensilsCrossed, Users } from 'lucide-react'

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

type FoodItem = {
  id: number
  name?: string
  description?: string
  meal_type?: string
  portion_grams?: number
  sequence?: number
  is_active?: boolean
}

type ListResponse<T> = {
  results?: T[]
}

const fallbackPlan: PlanItem = {
  id: 1,
  name: 'Plan Balance Saludable',
  description: 'Plan de ejemplo cargado mientras el backend responde.',
  goal: 'Mejorar composición corporal',
  target_calories: 1850,
  duration_weeks: 8,
  estimated_cost: '250.00',
  is_active: true,
  total_alimentos: 4,
  created_at: new Date().toISOString(),
}

const fallbackFoods: FoodItem[] = [
  { id: 1, name: 'Avena con fruta', description: 'Desayuno energético', meal_type: 'DESAYUNO', portion_grams: 250, sequence: 1, is_active: true },
  { id: 2, name: 'Pechuga con ensalada', description: 'Almuerzo principal', meal_type: 'ALMUERZO', portion_grams: 350, sequence: 2, is_active: true },
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

export default function PatientPlanDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const planId = params.id ?? ''
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [plan, setPlan] = useState<PlanItem | null>(null)
  const [foods, setFoods] = useState<FoodItem[]>([])

  useEffect(() => {
    let ignore = false

    async function loadPlan() {
      try {
        setLoading(true)
        setErrorMessage('')

        const [planResponse, foodsResponse] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}/planes/${planId}/`),
          fetch(`${API_CONFIG.BASE_URL}/planes/${planId}/alimentos/`),
        ])

        if (!planResponse.ok) {
          throw new Error(`HTTP ${planResponse.status}`)
        }

        const planData = (await planResponse.json()) as PlanItem

        let foodItems: FoodItem[] = []
        if (foodsResponse.ok) {
          const foodsData = (await foodsResponse.json()) as ListResponse<FoodItem> | FoodItem[]
          foodItems = Array.isArray(foodsData) ? foodsData : Array.isArray(foodsData.results) ? foodsData.results : []
        }

        if (!ignore) {
          setPlan(planData ?? fallbackPlan)
          setFoods(foodItems.length > 0 ? foodItems : fallbackFoods)
        }
      } catch {
        if (!ignore) {
          setPlan(fallbackPlan)
          setFoods(fallbackFoods)
          setErrorMessage('No se pudo leer el detalle desde el backend. Se muestran datos de ejemplo.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    if (planId) {
      loadPlan()
    } else {
      setPlan(fallbackPlan)
      setFoods(fallbackFoods)
      setLoading(false)
      setErrorMessage('No se encontró un plan válido.')
    }

    return () => {
      ignore = true
    }
  }, [planId])

  const foodTotal = useMemo(() => foods.length, [foods])

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/patient/plans')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100 transition hover:bg-emerald-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <ShieldPlus className="h-5 w-5" />
            </span>
            Detalle del plan
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-700 shadow-sm">J</button>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="mb-6 flex items-center gap-3 rounded-[1.75rem] border border-slate-100 bg-white p-5 text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <LoaderCircle className="h-6 w-6 animate-spin text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-800">Cargando detalle del plan...</p>
              <p className="text-sm text-slate-500">Consultando el backend para mostrar la información actualizada.</p>
            </div>
          </div>
        ) : null}

        <section className="rounded-[2rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Plan seleccionado</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-800">{plan?.name ?? 'Detalle no disponible'}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{plan?.description ?? 'Cargando información del backend...'}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className={`rounded-2xl px-4 py-3 ${plan?.is_active ? 'border border-emerald-100 bg-emerald-50' : 'border border-slate-100 bg-slate-50'}`}>
                <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${plan?.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>Estado</div>
                <div className={`mt-1 text-2xl font-semibold ${plan?.is_active ? 'text-emerald-700' : 'text-slate-700'}`}>{plan?.is_active ? 'Activo' : 'Inactivo'}</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Calorías</div>
                <div className="mt-1 text-2xl font-semibold text-slate-800">{plan?.target_calories ?? 0} kcal</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Costo</div>
                <div className="mt-1 text-2xl font-semibold text-slate-800">{plan ? formatPrice(plan.estimated_cost) : 'S/ 0.00'}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-[1.5rem] bg-emerald-500 p-5 text-white shadow-[0_16px_40px_rgba(34,197,94,0.22)] md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/85">Objetivo</p>
                  <h2 className="text-2xl font-semibold">{plan?.goal ?? 'Sin objetivo'}</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-white/80">Semanas</p>
                  <div className="mt-1 text-xl font-semibold">{plan?.duration_weeks ?? 0}</div>
                </div>
                <div>
                  <p className="text-sm text-white/80">Alimentos</p>
                  <div className="mt-1 text-xl font-semibold">{plan?.total_alimentos ?? foodTotal}</div>
                </div>
                <div>
                  <p className="text-sm text-white/80">Creado</p>
                  <div className="mt-1 text-sm font-semibold leading-6">{plan ? formatDate(plan.created_at) : 'Fecha no disponible'}</div>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-500">Resumen</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Plan nutricional</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan?.description ?? 'Cargando...'}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-500">Alimentos activos</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{foodTotal}</h3>
                  <p className="mt-1 text-sm text-slate-500">Alimentos retornados por la API</p>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Alimentos programados</h2>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  Ordenados por secuencia
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {foods.map((food) => (
                  <article key={food.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                          <UtensilsCrossed className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{food.name ?? 'Alimento sin nombre'}</h3>
                          <p className="mt-1 text-sm text-slate-500">{food.description ?? 'Sin descripción'}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-100">Tipo: {food.meal_type ?? 'N/D'}</span>
                        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-100">Porción: {food.portion_grams ?? 0} g</span>
                        <span className={`rounded-full px-3 py-1 ${food.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {food.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}

                {foods.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-slate-500">
                    No hay alimentos retornados para este plan.
                  </div>
                ) : null}
              </div>
            </section>

            <aside className="space-y-6">
              <article className="rounded-[1.75rem] bg-emerald-500 p-5 text-white shadow-[0_16px_40px_rgba(34,197,94,0.22)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/85">Estado</p>
                    <h2 className="text-2xl font-semibold">{plan?.is_active ? 'Listo para usar' : 'Plan inactivo'}</h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/85">
                  Este detalle está enlazado al backend. Cuando el plan cambie en Django, esta pantalla mostrará los datos actualizados.
                </p>
              </article>

              <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Fuentes consultadas</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-500">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <ShieldPlus className="h-5 w-5 text-emerald-500" />
                    <span><span className="font-semibold text-slate-700">GET /api/planes/{planId}/</span></span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <Users className="h-5 w-5 text-emerald-500" />
                    <span><span className="font-semibold text-slate-700">GET /api/planes/{planId}/alimentos/</span></span>
                  </div>
                </div>
              </article>

              {errorMessage ? (
                <article className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                  {errorMessage}
                </article>
              ) : null}
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}