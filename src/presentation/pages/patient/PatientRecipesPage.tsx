// src/presentation/pages/patient/PatientRecipesPage.tsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  Search, 
  Filter, 
  Heart, 
  ArrowRight, 
  Flame, 
  Clock3, 
  ChefHat, 
  Wheat, 
  Menu,
  Sun,
  Moon,
  MessageSquareText,
  UtensilsCrossed,
  House
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

interface Recipe {
  id: number
  name: string
  subtitle: string
  image: string
  kcal: number
  minutes: number
  mealType: string
  favorite: boolean
  tag: string
  difficulty: string
  ingredients: string[]
  steps: string[]
}

interface RecipeApiItem {
  id: number
  nombre: string
  descripcion?: string
  calorias?: number
  tiempo_preparacion?: number
  categoria_nombre?: string
  momento_nombre?: string
  imagen?: string
  ingredientes?: string | string[]
  pasos?: string | string[]
}

interface ApiListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const fallbackRecipes: Recipe[] = [
  {
    id: 101,
    name: 'Fajitas de Res con Pimientos',
    subtitle: 'Tiras de lomo fino salteadas al wok con pimientos tricolor, cebolla morada y sazón criollo bajo en grasa.',
    image: '/assets/recipe_banner.png',
    kcal: 380,
    minutes: 20,
    mealType: 'Almuerzo',
    favorite: true,
    tag: 'Recomendado',
    difficulty: 'Fácil',
    ingredients: ['200g lomo de res', '1 pimiento rojo', '1 pimiento verde', '1/2 cebolla', '1 cdta aceite de oliva', 'Sal y pimienta al gusto'],
    steps: ['Corta la carne y los vegetales en tiras finas.', 'Calienta el aceite en un wok a fuego alto.', 'Saltea la carne por 5 minutos hasta que dore.', 'Agrega los pimientos y cebollas, saltea 5 minutos más.', 'Sazona con sal, pimienta y sirve de inmediato.']
  },
  {
    id: 102,
    name: 'Crema de Calabacín Ligera',
    subtitle: 'Sopa cremosa de calabacín tierno, puerro y un toque de queso ricotta bajo en grasa.',
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&auto=format&fit=crop&q=80',
    kcal: 180,
    minutes: 15,
    mealType: 'Cena',
    favorite: false,
    tag: 'Bajo en calorías',
    difficulty: 'Fácil',
    ingredients: ['2 calabacines medianos', '1 puerro', '1 taza caldo de verduras', '2 cdas ricotta light', 'Nuez moscada'],
    steps: ['Pica el calabacín y el puerro.', 'Cocina en el caldo de verduras por 10 minutos hasta que estén suaves.', 'Licúa todo junto con el queso ricotta hasta obtener una textura tersa.', 'Sazona con nuez moscada, sal y pimienta al gusto.']
  },
  {
    id: 103,
    name: 'Parfait de Yogur y Granola',
    subtitle: 'Capas de yogur griego natural, fresas frescas picadas y granola artesanal sin azúcar añadida.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    kcal: 220,
    minutes: 5,
    mealType: 'Desayuno',
    favorite: true,
    tag: 'Proteico',
    difficulty: 'Fácil',
    ingredients: ['200g yogur griego', '4 fresas medianas', '3 cdas granola integral', '1 chorrito de miel de agave'],
    steps: ['Lava y pica las fresas en rodajas pequeñas.', 'En un vaso, coloca una base de yogur griego.', 'Añade una capa de fresas y una capa de granola.', 'Repite las capas y finaliza con un chorrito de miel de agave.']
  }
]

function buildRecipes(apiItems: RecipeApiItem[]): Recipe[] {
  if (!apiItems || apiItems.length === 0) return fallbackRecipes
  return apiItems.map((item, idx) => {
    let listIngredients: string[] = ['Ingredientes variados']
    if (typeof item.ingredientes === 'string') {
      try {
        const parsed = JSON.parse(item.ingredientes.replace(/'/g, '"'))
        if (Array.isArray(parsed)) listIngredients = parsed
      } catch {
        listIngredients = item.ingredientes.split(',').map((x) => x.trim())
      }
    } else if (Array.isArray(item.ingredientes)) {
      listIngredients = item.ingredientes
    }

    let listSteps: string[] = ['Pasos de preparación estándar']
    if (typeof item.pasos === 'string') {
      try {
        const parsed = JSON.parse(item.pasos.replace(/'/g, '"'))
        if (Array.isArray(parsed)) listSteps = parsed
      } catch {
        listSteps = item.pasos.split('.').map((x) => x.trim()).filter(Boolean)
      }
    } else if (Array.isArray(item.pasos)) {
      listSteps = item.pasos
    }

    return {
      id: item.id,
      name: item.nombre,
      subtitle: item.descripcion || 'Detalles y porciones sugeridas por tu nutricionista.',
      image: item.imagen || fallbackRecipes[idx % fallbackRecipes.length].image,
      kcal: item.calorias || 280,
      minutes: item.tiempo_preparacion || 15,
      mealType: item.momento_nombre || 'Almuerzo',
      favorite: idx % 2 === 0,
      tag: item.categoria_nombre || 'Nutritivo',
      difficulty: 'Fácil',
      ingredients: listIngredients,
      steps: listSteps
    }
  })
}

export default function PatientRecipesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'Desayuno' | 'Almuerzo' | 'Cena'>('all')

  const filters = [
    { label: 'Todos', value: 'all' },
    { label: 'Desayuno', value: 'Desayuno' },
    { label: 'Almuerzo', value: 'Almuerzo' },
    { label: 'Cena', value: 'Cena' }
  ]

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

  useEffect(() => {
    if (user?.id) {
      loadUserProfile()
    }
  }, [user])

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'

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

  const avatarUrlResolved = getAvatarUrl(userProfileData?.avatar_url)

  return (
    <main className="min-h-screen bg-bg-main text-text-main transition-colors duration-300 pb-28">
      {/* Floating Navbar Header */}
      <header className="sticky top-0 z-30 border-b border-card-border bg-header-bg backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/patient/menu')}
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
            <button onClick={() => navigate('/patient/plan')} className="hover:text-emerald-500 transition">Mi Plan</button>
            <button onClick={() => navigate('/patient/recipes')} className="text-emerald-500 font-bold transition">Recetas</button>
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

      {/* Main Content Grid */}
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-[2.5rem] bg-card-bg border border-card-border p-6 shadow-sm transition-all duration-300 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">Menú saludable</p>
              <h1 className="text-3xl font-black text-text-main tracking-tight uppercase">Explora recetas rápidas y nutritivas</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
                Puedes buscar por nombre, filtrar por momento de comida y revisar los detalles antes de elegir una receta para tu plan.
              </p>
            </div>

            <div className="grid gap-3 grid-cols-3">
              <article className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Recetas</div>
                <div className="mt-1 text-2xl font-black text-emerald-400">{recipes.length}</div>
              </article>
              <article className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 text-center transition-colors duration-300">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Filtradas</div>
                <div className="mt-1 text-2xl font-black text-text-main">{filteredRecipes.length}</div>
              </article>
              <article className="rounded-2xl border border-card-border bg-input-bg px-4 py-3 text-center transition-colors duration-300">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Favoritas</div>
                <div className="mt-1 text-2xl font-black text-text-main">{recipes.filter((recipe) => recipe.favorite).length}</div>
              </article>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1 rounded-2xl bg-input-bg border border-card-border px-4 py-3.5 transition-all duration-300">
              <div className="flex items-center gap-3 text-slate-400">
                <Search className="h-5 w-5 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar recetas..."
                  className="w-full bg-transparent text-sm font-medium text-text-main outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <button className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400">
              <Filter className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value as typeof activeFilter)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === filter.value 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/15' 
                    : 'bg-input-bg text-slate-400 border border-card-border hover:bg-slate-500/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-8 rounded-3xl border border-dashed border-card-border bg-input-bg/50 p-10 text-center text-slate-400">
              Cargando recetas desde el backend...
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-4">
              {filteredRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  onClick={() => setSelectedId(recipe.id)}
                  className={`cursor-pointer rounded-[1.75rem] border p-4 transition-all duration-300 sm:p-5 ${
                    selectedRecipe?.id === recipe.id 
                      ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5' 
                      : 'border-card-border bg-card-bg hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-card-border bg-input-bg transition-colors duration-300">
                      <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-extrabold text-text-main uppercase tracking-tight">{recipe.name}</h2>
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400">{recipe.tag}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-normal">{recipe.subtitle}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                        <span className="inline-flex items-center gap-1.5"><Flame className="h-4 w-4 text-emerald-500" />{recipe.kcal} kcal</span>
                        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-emerald-500" />{recipe.minutes} min</span>
                        <span className="inline-flex items-center gap-1.5"><ChefHat className="h-4 w-4 text-emerald-500" />{recipe.mealType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Heart className={`h-5 w-5 ${recipe.favorite ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                      <ArrowRight className="h-5 w-5 text-slate-500" />
                    </div>
                  </div>
                </article>
              ))}

              {filteredRecipes.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-card-border bg-input-bg/50 p-8 text-center text-slate-500">
                  No hay recetas que coincidan con tu búsqueda.
                </div>
              ) : null}

              {errorMessage ? <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">{errorMessage}</div> : null}
            </section>

            <aside className="space-y-6">
              <article className="overflow-hidden rounded-[1.75rem] bg-card-bg border border-card-border shadow-sm relative group/detail transition-all duration-300">
                {selectedRecipe?.image && (
                  <div className="w-full h-48 relative overflow-hidden bg-slate-900">
                    <img 
                      src={selectedRecipe.image} 
                      alt={selectedRecipe.name} 
                      className="w-full h-full object-cover transition-transform duration-550 group-hover/detail:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-mono text-[9px] tracking-widest uppercase text-emerald-400">Receta seleccionada</p>
                      <h2 className="text-xl font-extrabold tracking-tight text-white mt-0.5 uppercase">{selectedRecipe.name}</h2>
                    </div>
                  </div>
                )}
                
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    {selectedRecipe?.subtitle ?? 'Selecciona una receta para ver su detalle.'}
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
                    <div className="rounded-2xl bg-input-bg border border-card-border px-3 py-3 transition-colors duration-300">
                      <div className="text-lg font-black text-text-main">{selectedRecipe?.kcal ?? 0}</div>
                      <div className="text-slate-500">kcal</div>
                    </div>
                    <div className="rounded-2xl bg-input-bg border border-card-border px-3 py-3 transition-colors duration-300">
                      <div className="text-lg font-black text-text-main">{selectedRecipe?.minutes ?? 0}</div>
                      <div className="text-slate-500">min</div>
                    </div>
                    <div className="rounded-2xl bg-input-bg border border-card-border px-3 py-3 transition-colors duration-300">
                      <div className="text-lg font-black text-text-main">{selectedRecipe?.difficulty ?? 'Fácil'}</div>
                      <div className="text-slate-500">Nivel</div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-[1.75rem] bg-card-bg border border-card-border p-5 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                    <Wheat className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ingredientes</p>
                    <h3 className="font-extrabold text-text-main uppercase">Lista base</h3>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  {(selectedRecipe?.ingredients ?? []).map((ingredient) => (
                    <li key={ingredient} className="flex items-center gap-2 rounded-2xl bg-input-bg border border-card-border px-3 py-2 transition-colors duration-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[1.75rem] bg-card-bg border border-card-border p-5 shadow-sm transition-all duration-300">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-extrabold text-text-main uppercase">Preparación</h3>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <Flame className="h-4 w-4 text-emerald-500" />
                    {selectedRecipe?.mealType ?? 'N/A'}
                  </span>
                </div>

                <ol className="mt-4 space-y-3 text-xs text-slate-300">
                  {(selectedRecipe?.steps ?? []).map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl bg-input-bg border border-card-border px-3 py-3 transition-colors duration-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </aside>
          </div>
        </section>
      </div>

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-3xl border border-card-border bg-card-bg/95 backdrop-blur-xl shadow-lg p-2.5">
        <div className="grid grid-cols-4 items-center">
          {[
            { label: 'Inicio', icon: House, href: '/patient/menu', active: false },
            { label: 'Mi Plan', icon: UtensilsCrossed, href: '/patient/plan', active: false },
            { label: 'Recetas', icon: ChefHat, href: '/patient/recipes', active: true },
            { label: 'Chat', icon: MessageSquareText, href: '/patient/chat', active: false },
          ].map(({ label, icon: Icon, href, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(href)}
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition ${
                active 
                  ? 'text-emerald-500 bg-emerald-500/5 font-extrabold' 
                  : 'text-slate-450 hover:text-emerald-500 hover:bg-slate-500/5'
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