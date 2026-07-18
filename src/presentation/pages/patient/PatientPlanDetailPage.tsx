import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  ArrowLeft, 
  CalendarDays, 
  CheckCircle2, 
  Clock3, 
  LoaderCircle, 
  ShieldPlus, 
  Sparkles, 
  UtensilsCrossed, 
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



function formatDate(dateValue: string) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

export default function PatientPlanDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { user } = useAuthStore()
  const planId = params.id ?? ''
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [plan, setPlan] = useState<PlanItem | null>(null)
  const [foods, setFoods] = useState<FoodItem[]>([])

  const [pacienteData, setPacienteData] = useState<any | null>(null)
  const [loadingSelect, setLoadingSelect] = useState(false)

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

  // Load patient profile to support plan selection
  const loadPatientProfile = async () => {
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/pacientes/?page_size=200`, { headers })
      if (response.ok) {
        const data = await response.json()
        const results = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []
        const patientObj = results.find((p: any) => p.user_id && Number(p.user_id) === Number(user?.id)) || results[0]
        setPacienteData(patientObj)
      }
    } catch (error) {
      console.error('Error loading patient data for selection:', error)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadPatientProfile()
    }
  }, [user])

  const handleSelectPlan = async () => {
    if (!pacienteData || !plan) return
    try {
      setLoadingSelect(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' }

      const response = await fetch(`${API_CONFIG.BASE_URL}/pacientes/${pacienteData.id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          plan_activo: plan.id
        })
      })

      if (response.ok) {
        alert(`¡Plan "${plan.name}" activado correctamente en tu perfil!`)
        navigate('/patient/plan')
      } else {
        const errData = await response.json()
        alert('No se pudo activar el plan: ' + JSON.stringify(errData))
      }
    } catch (err) {
      console.error('Error selecting active diet plan:', err)
      alert('Error de red al activar el plan.')
    } finally {
      setLoadingSelect(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function loadPlan() {
      try {
        setLoading(true)
        setErrorMessage('')

        const token = localStorage.getItem('dietetic_access_token')
        const [planResponse, foodsResponse] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}/planes/${planId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_CONFIG.BASE_URL}/planes/${planId}/alimentos/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
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
    <main className="min-h-screen bg-bg-main text-text-main transition-colors duration-300 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-card-border bg-header-bg backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/patient/plans')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-input-bg text-slate-400 transition hover:bg-slate-500/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-bold text-text-main uppercase">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldPlus className="h-5 w-5" />
            </span>
            Detalle del plan
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
        {loading ? (
          <div className="mb-6 flex items-center gap-3 rounded-[1.75rem] border border-card-border bg-card-bg p-5 text-slate-400 shadow-sm transition-colors duration-300">
            <LoaderCircle className="h-6 w-6 animate-spin text-emerald-500" />
            <div>
              <p className="font-semibold text-text-main">Cargando detalle del plan...</p>
              <p className="text-sm text-slate-500">Consultando el backend para mostrar la información actualizada.</p>
            </div>
          </div>
        ) : null}

        <section className="rounded-[2rem] bg-card-bg border border-card-border p-4 shadow-sm sm:p-6 lg:p-8 transition-all duration-300">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">Plan seleccionado</p>
              <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">{plan?.name ?? 'Detalle no disponible'}</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-400">{plan?.description ?? 'Cargando información del backend...'}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className={`rounded-2xl px-4 py-3 ${plan?.is_active ? 'border border-emerald-500/25 bg-emerald-500/10' : 'border border-card-border bg-input-bg'}`}>
                <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${plan?.is_active ? 'text-emerald-450' : 'text-slate-500'}`}>Estado</div>
                <div className={`mt-1 text-2xl font-black ${plan?.is_active ? 'text-emerald-400' : 'text-text-main'}`}>{plan?.is_active ? 'Activo' : 'Inactivo'}</div>
              </div>
              <div className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 transition-colors duration-300">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Calorías</div>
                <div className="mt-1 text-2xl font-black text-text-main">{plan?.target_calories ?? 0} kcal</div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-[1.5rem] bg-emerald-500 p-5 text-slate-950 shadow-lg shadow-emerald-500/15 md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Sparkles className="h-6 w-6 text-slate-950" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Objetivo</p>
                  <h2 className="text-xl font-black uppercase tracking-tight">{plan?.goal ?? 'Sin objetivo'}</h2>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-3 text-center">
                <div className="bg-white/10 rounded-2xl py-2">
                  <p className="text-[9px] font-bold text-slate-900 uppercase">Semanas</p>
                  <div className="mt-1 text-xl font-black">{plan?.duration_weeks ?? 0}</div>
                </div>
                <div className="bg-white/10 rounded-2xl py-2">
                  <p className="text-[9px] font-bold text-slate-900 uppercase">Alimentos</p>
                  <div className="mt-1 text-xl font-black">{plan?.total_alimentos ?? foodTotal}</div>
                </div>
                <div className="bg-white/10 rounded-2xl py-2">
                  <p className="text-[9px] font-bold text-slate-900 uppercase">Creado</p>
                  <div className="mt-1 text-xs font-bold leading-6 truncate">{plan ? formatDate(plan.created_at) : 'N/A'}</div>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] bg-input-bg border border-card-border p-5 shadow-sm transition-all duration-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resumen</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-text-main uppercase text-xs">Plan nutricional</h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{plan?.description ?? 'Cargando...'}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] bg-input-bg border border-card-border p-5 shadow-sm transition-all duration-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alimentos activos</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-text-main text-lg leading-tight">{foodTotal}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Alimentos retornados por la API</p>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[1.75rem] bg-input-bg border border-card-border p-5 shadow-sm transition-all duration-300 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-text-main uppercase">Alimentos programados</h2>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                  <Clock3 className="h-4 w-4 text-emerald-500" />
                  Ordenados por secuencia
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {foods.map((food) => (
                  <article key={food.id} className="rounded-[1.5rem] border border-card-border bg-card-bg p-4 transition-colors duration-300">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-input-bg border border-card-border text-emerald-500 shadow-sm transition-colors duration-300">
                          <UtensilsCrossed className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-text-main uppercase text-sm">{food.name ?? 'Alimento sin nombre'}</h3>
                          <p className="mt-1 text-xs text-slate-455 leading-relaxed">{food.description ?? 'Sin descripción'}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                        <span className="rounded-full bg-input-bg border border-card-border text-slate-400 px-3 py-1 transition-colors duration-300">Tipo: {food.meal_type ?? 'N/D'}</span>
                        <span className="rounded-full bg-input-bg border border-card-border text-slate-400 px-3 py-1 transition-colors duration-300">Porción: {food.portion_grams ?? 0} g</span>
                        <span className={`rounded-full px-3 py-1 ${food.is_active ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450' : 'bg-slate-500/10 border border-card-border text-slate-500'}`}>
                          {food.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}

                {foods.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-card-border bg-card-bg p-8 text-center text-slate-500">
                    No hay alimentos retornados para este plan.
                  </div>
                ) : null}
              </div>
            </section>

            <aside className="space-y-6">
              {/* Premium Activation Button */}
              {plan && (
                <button
                  type="button"
                  onClick={handleSelectPlan}
                  disabled={loadingSelect}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 py-4 text-xs font-black uppercase tracking-widest text-slate-950 transition shadow-lg shadow-emerald-500/15 active:scale-[0.98] disabled:opacity-50"
                >
                  {loadingSelect ? (
                    <LoaderCircle className="h-5 w-5 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Activar este Plan
                    </>
                  )}
                </button>
              )}

              <article className="rounded-[1.75rem] bg-emerald-500 p-5 text-slate-950 shadow-lg shadow-emerald-500/15 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                    <CheckCircle2 className="h-6 w-6 text-slate-950" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-900 uppercase">Estado</p>
                    <h2 className="text-xl font-black uppercase tracking-tight">{plan?.is_active ? 'Listo para usar' : 'Plan inactivo'}</h2>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-900 font-semibold">
                  Al hacer clic en "Activar este Plan", este plan de alimentación se establecerá como tu régimen activo en tu perfil clínico.
                </p>
              </article>

              {errorMessage ? (
                <article className="rounded-[1.75rem] border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-xs text-amber-300">
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