import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { ArrowRight, ChefHat, Clock3, Filter, Flame, Heart, Menu, Search, ShieldPlus, Sparkles, UtensilsCrossed, Wheat } from 'lucide-react'

type RecipeApiItem = {
  id: number
  name: string
  description?: string
  meal_type?: string
  portion_grams?: number
  sequence?: number
  is_active?: boolean
}

type ApiListResponse<T> = {
  results?: T[]
}

type Recipe = {
  id: number
  name: string
  subtitle: string
  mealType: string
  kcal: number
  minutes: number
  ingredients: string[]
  steps: string[]
  tag: string
  favorite: boolean
  difficulty: 'Fácil' | 'Media' | 'Alta'
}

const fallbackRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Huevos Revueltos con Aguacate',
    subtitle: 'Desayuno equilibrado con proteína y grasas saludables',
    mealType: 'Desayuno',
    kcal: 320,
    minutes: 15,
    ingredients: ['2 huevos', '1/2 aguacate', 'tomate cherry', 'pan integral'],
    steps: ['Batir los huevos', 'Cocinar a fuego medio', 'Servir con aguacate y tomate'],
    tag: 'Energía rápida',
    favorite: true,
    difficulty: 'Fácil',
  },
  {
    id: 2,
    name: 'Pechuga de Pollo con Verduras',
    subtitle: 'Plato principal alto en proteína y bajo en grasa',
    mealType: 'Proteínas',
    kcal: 450,
    minutes: 25,
    ingredients: ['pechuga de pollo', 'brócoli', 'zanahoria', 'aceite de oliva'],
    steps: ['Sazonar el pollo', 'Sellar a fuego medio', 'Saltear las verduras y emplatar'],
    tag: 'Alta saciedad',
    favorite: false,
    difficulty: 'Media',
  },
  {
    id: 3,
    name: 'Pescado con Ensalada César',
    subtitle: 'Cena ligera con verduras frescas y proteína magra',
    mealType: 'Cena',
    kcal: 380,
    minutes: 20,
    ingredients: ['filete de pescado', 'lechuga romana', 'crutones integrales', 'aderezo ligero'],
    steps: ['Cocinar el pescado', 'Preparar la ensalada', 'Servir todo junto'],
    tag: 'Ligero',
    favorite: false,
    difficulty: 'Fácil',
  },
]

const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Desayuno', value: 'Desayuno' },
  { label: 'Proteínas', value: 'Proteínas' },
  { label: 'Cena', value: 'Cena' },
]

function mealTypeLabel(value?: string) {
  if (!value) return 'Sin categoría'
  const normalized = value.toLowerCase()
  if (normalized.includes('desayuno')) return 'Desayuno'
  if (normalized.includes('almuerzo')) return 'Proteínas'
  if (normalized.includes('cena')) return 'Cena'
  if (normalized.includes('snack')) return 'Snacks'
  return value
}

function buildRecipes(apiItems: RecipeApiItem[]) {
  if (apiItems.length === 0) return fallbackRecipes

  const byName = new Map(fallbackRecipes.map((recipe) => [recipe.name.toLowerCase(), recipe]))

  return apiItems.map((item, index) => {
    const fallback = byName.get(item.name.toLowerCase())
    const mealType = mealTypeLabel(item.meal_type)

    return {
      id: item.id,
      name: item.name,
      subtitle: item.description ?? fallback?.subtitle ?? 'Receta disponible para tu plan',
      mealType,
      kcal: fallback?.kcal ?? Math.max(180, Math.round((item.portion_grams ?? 220) * 1.35)),
      minutes: fallback?.minutes ?? (item.sequence ? 10 + item.sequence * 3 : 20 + index * 2),
      ingredients: fallback?.ingredients ?? ['Ingrediente principal', 'Guarnición fresca', 'Condimentos naturales'],
      steps: fallback?.steps ?? ['Preparar los ingredientes', 'Cocinar según indicación', 'Servir y disfrutar'],
      tag: item.is_active ? 'Disponible' : 'Desactivado',
      favorite: fallback?.favorite ?? item.id % 2 === 1,
      difficulty: fallback?.difficulty ?? 'Fácil',
    } satisfies Recipe
  })
}

export default function PatientRecipesPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState<Recipe[]>(fallbackRecipes)
  const [selectedId, setSelectedId] = useState<number | null>(fallbackRecipes[0].id)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'Desayuno' | 'Proteínas' | 'Cena'>('all')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadRecipes() {
      try {
        setLoading(true)
        setErrorMessage('')

        const response = await fetch(`${API_CONFIG.BASE_URL}/alimentos/available/?page_size=100`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const payload = (await response.json()) as ApiListResponse<RecipeApiItem> | RecipeApiItem[]
        const apiItems = Array.isArray(payload) ? payload : payload.results ?? []
        const mapped = buildRecipes(apiItems)

        if (!ignore) {
          setRecipes(mapped)
          setSelectedId((current) => (mapped.some((recipe) => recipe.id === current) ? current : mapped[0]?.id ?? current))
        }
      } catch {
        if (!ignore) {
          setRecipes(fallbackRecipes)
          setSelectedId(fallbackRecipes[0].id)
          setErrorMessage('No se pudo leer el backend. Se muestran recetas de ejemplo.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadRecipes()

    return () => {
      ignore = true
    }
  }, [])

  const filteredRecipes = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const matchesQuery =
        needle.length === 0 ||
        recipe.name.toLowerCase().includes(needle) ||
        recipe.subtitle.toLowerCase().includes(needle) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(needle))

      const matchesFilter = activeFilter === 'all' || recipe.mealType === activeFilter

      return matchesQuery && matchesFilter
    })
  }, [activeFilter, query, recipes])

  const selectedRecipe = filteredRecipes.find((recipe) => recipe.id === selectedId) ?? filteredRecipes[0] ?? null

  useEffect(() => {
    if (filteredRecipes.length === 0) {
      setSelectedId(null)
      return
    }

    if (!selectedRecipe || !filteredRecipes.some((recipe) => recipe.id === selectedRecipe.id)) {
      setSelectedId(filteredRecipes[0].id)
    }
  }, [filteredRecipes, recipes, selectedRecipe])

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/patient/menu')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100 transition hover:bg-emerald-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <ShieldPlus className="h-5 w-5" />
            </span>
            Recetas
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-700 shadow-sm">
            J
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-5 pb-28 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Menú saludable</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-800">Explora recetas rápidas y nutritivas</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                Puedes buscar por nombre, filtrar por momento de comida y revisar los detalles antes de elegir una receta para tu plan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Recetas</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-700">{recipes.length}</div>
              </article>
              <article className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Filtradas</div>
                <div className="mt-1 text-2xl font-semibold text-slate-800">{filteredRecipes.length}</div>
              </article>
              <article className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Favoritas</div>
                <div className="mt-1 text-2xl font-semibold text-slate-800">{recipes.filter((recipe) => recipe.favorite).length}</div>
              </article>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1 rounded-[1.5rem] bg-[#f7f9fc] px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)] ring-1 ring-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <Search className="h-5 w-5" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar recetas..."
                  className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            <button className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.5rem] bg-emerald-500 text-white shadow-[0_12px_28px_rgba(34,197,94,0.25)] transition hover:bg-emerald-600">
              <Filter className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value as typeof activeFilter)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter.value ? 'bg-emerald-500 text-white shadow-[0_10px_24px_rgba(34,197,94,0.22)]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center text-slate-500">
              Cargando recetas desde el backend...
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-4">
              {filteredRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  onClick={() => setSelectedId(recipe.id)}
                  className={`cursor-pointer rounded-[1.75rem] border p-4 transition sm:p-5 ${
                    selectedRecipe?.id === recipe.id ? 'border-emerald-200 bg-emerald-50/60 shadow-[0_12px_26px_rgba(34,197,94,0.08)]' : 'border-slate-100 bg-white shadow-[0_12px_26px_rgba(15,23,42,0.04)] hover:border-emerald-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <UtensilsCrossed className="h-8 w-8" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg font-semibold text-slate-800">{recipe.name}</h2>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 ring-1 ring-emerald-100">{recipe.tag}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{recipe.subtitle}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><Flame className="h-4 w-4 text-emerald-500" />{recipe.kcal} kcal</span>
                        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-emerald-500" />{recipe.minutes} min</span>
                        <span className="inline-flex items-center gap-1.5"><ChefHat className="h-4 w-4 text-emerald-500" />{recipe.mealType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Heart className={`h-5 w-5 ${recipe.favorite ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                      <ArrowRight className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>
                </article>
              ))}

              {filteredRecipes.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-slate-500">
                  No hay recetas que coincidan con tu búsqueda.
                </div>
              ) : null}

              {errorMessage ? <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{errorMessage}</div> : null}
            </section>

            <aside className="space-y-6">
              <article className="rounded-[1.75rem] bg-emerald-500 p-5 text-white shadow-[0_16px_40px_rgba(34,197,94,0.22)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/85">Receta seleccionada</p>
                    <h2 className="text-2xl font-semibold">{selectedRecipe?.name ?? 'Sin selección'}</h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/85">{selectedRecipe?.subtitle ?? 'Selecciona una receta para ver su detalle.'}</p>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-semibold">
                  <div className="rounded-2xl bg-white/12 px-3 py-3">
                    <div className="text-xl">{selectedRecipe?.kcal ?? 0}</div>
                    <div className="text-white/75">kcal</div>
                  </div>
                  <div className="rounded-2xl bg-white/12 px-3 py-3">
                    <div className="text-xl">{selectedRecipe?.minutes ?? 0}</div>
                    <div className="text-white/75">min</div>
                  </div>
                  <div className="rounded-2xl bg-white/12 px-3 py-3">
                    <div className="text-xl">{selectedRecipe?.difficulty ?? 'Fácil'}</div>
                    <div className="text-white/75">Nivel</div>
                  </div>
                </div>
              </article>

              <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <Wheat className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Ingredientes</p>
                    <h3 className="font-semibold text-slate-800">Lista base</h3>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {(selectedRecipe?.ingredients ?? []).map((ingredient) => (
                    <li key={ingredient} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-800">Preparación</h3>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                    <Flame className="h-4 w-4 text-emerald-500" />
                    {selectedRecipe?.mealType ?? 'N/A'}
                  </span>
                </div>

                <ol className="mt-4 space-y-3 text-sm text-slate-600">
                  {(selectedRecipe?.steps ?? []).map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </aside>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1600px] grid-cols-5 px-2 py-2 sm:px-6 lg:px-8">
          {[
            { label: 'Inicio', icon: Menu, href: '/patient/menu', active: false },
            { label: 'Mi Plan', icon: UtensilsCrossed, href: '/patient/plan', active: false },
            { label: 'Recetas', icon: ChefHat, href: '/patient/recipes', active: true },
            { label: 'Progreso', icon: Wheat, href: '/patient/menu', active: false },
            { label: 'Chat', icon: ShieldPlus, href: '/patient/menu', active: false },
          ].map(({ label, icon: Icon, href, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(href)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-xs font-semibold transition ${active ? 'text-emerald-600' : 'text-slate-300'}`}
            >
              <Icon className="h-6 w-6" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  )
}