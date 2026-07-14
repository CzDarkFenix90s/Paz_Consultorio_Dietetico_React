import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CalendarCheck2, ChartColumn, ChevronRight, Clock3, Droplets, Footprints, House, LayoutList, Menu, MessageSquareText, MoonStar, PanelLeftClose, Settings, ShieldPlus, SquareUserRound, UtensilsCrossed, UserCircle2 } from 'lucide-react'

const summaryCards = [
  {
    icon: Droplets,
    title: 'Agua hoy',
    value: '0.0 L',
    tone: 'from-sky-50 to-blue-50 text-sky-600',
  },
  {
    icon: Footprints,
    title: 'Ejercicio',
    value: 'Pendiente',
    tone: 'from-amber-50 to-orange-50 text-orange-500',
  },
]

const meals = [
  {
    title: 'Almuerzo: Pechuga a la plancha',
    time: '13:30 PM',
    icon: UtensilsCrossed,
  },
]

const bottomNav = [
  { label: 'Inicio', icon: Menu, active: true },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
  { label: 'Recetas', icon: CalendarCheck2, active: false },
  { label: 'Progreso', icon: Footprints, active: false },
  { label: 'Chat', icon: MessageSquareText, active: false },
]

const drawerGroups = [
  {
    title: 'MI SALUD',
    items: [
      { label: 'Inicio', icon: House, active: true },
      { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
      { label: 'Seguimiento', icon: ChartColumn, active: false },
    ],
  },
  {
    title: 'CONSULTAS',
    items: [
      { label: 'Chat Nutri', icon: MessageSquareText, active: false },
      { label: 'Mis Citas', icon: CalendarCheck2, active: false },
      { label: 'Perfil', icon: SquareUserRound, active: false },
    ],
  },
]

export default function PatientMenuPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100 transition hover:bg-emerald-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <ShieldPlus className="h-5 w-5" />
            </span>
            ALEXIS PAZ ESTUVO AQUI
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-700 shadow-sm">
              J
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          className={`absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-[min(86vw,420px)] flex-col overflow-hidden bg-white shadow-[24px_0_60px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="relative flex min-h-[300px] flex-col justify-between bg-[linear-gradient(180deg,#4caf50_0%,#43a047_100%)] px-6 pb-8 pt-7 text-white">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/20"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-start gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white text-emerald-600 shadow-[0_14px_30px_rgba(0,0,0,0.15)]">
                  <UserCircle2 className="h-12 w-12" />
                </div>

                <div>
                  <p className="text-lg font-semibold text-white/95">john</p>
                  <span className="mt-3 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/95">
                    Paciente
                  </span>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.18))]" />
            </div>

            <div className="px-4 py-5">
              {drawerGroups.map((group) => (
                <section key={group.title} className="mb-6 last:mb-0">
                  <h2 className="px-3 text-xs font-bold tracking-[0.28em] text-slate-300">{group.title}</h2>
                  <div className="mt-4 space-y-2">
                    {group.items.map(({ label, icon: Icon, active }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setMenuOpen(false)
                          if (label === 'Mi Plan') {
                            navigate('/patient/plan')
                          }
                        }}
                        className={`flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold transition ${
                          active
                            ? 'bg-[#4caf50] text-white shadow-[0_10px_20px_rgba(76,175,80,0.22)]'
                            : 'text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`h-6 w-6 shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}

              <section>
                <h2 className="px-3 text-xs font-bold tracking-[0.28em] text-slate-300">AJUSTES</h2>
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    <Settings className="h-6 w-6 shrink-0 text-slate-500" />
                    <span>Configuración</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    <MoonStar className="h-6 w-6 shrink-0 text-slate-500" />
                    <span>Modo noche</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    <LayoutList className="h-6 w-6 shrink-0 text-slate-500" />
                    <span>Más opciones</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm">
                <UserCircle2 className="h-12 w-12" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400">Bienvenido de vuelta,</p>
                <h1 className="text-3xl font-medium tracking-tight text-slate-800">john</h1>
              </div>
            </div>

            <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50">
              <Settings className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Mi resumen diario</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {summaryCards.map(({ icon: Icon, title, value, tone }) => (
                  <article key={title} className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone.split(' ')[0]} ${tone.split(' ')[1]} text-xl`}>
                      <Icon className={`h-6 w-6 ${tone.split(' ')[2]}`} />
                    </div>
                    <div className="mt-4 text-3xl font-semibold text-slate-800">{value}</div>
                    <div className="mt-1 text-sm font-medium text-slate-500">{title}</div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Progreso físico</h2>
              <article className="mt-4 rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-6">
                <div className="grid gap-6 md:grid-cols-3 md:items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Actual</p>
                    <div className="mt-2 text-4xl font-semibold text-slate-800">
                      78.5
                      <span className="text-xl font-medium text-slate-400">kg</span>
                    </div>
                  </div>
                  <div className="hidden h-12 justify-self-center border-l border-slate-200 md:block" />
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Meta</p>
                    <div className="mt-2 text-4xl font-semibold text-slate-800">
                      72.0
                      <span className="text-xl font-medium text-slate-400">kg</span>
                    </div>
                  </div>
                  <div className="hidden h-12 justify-self-center border-l border-slate-200 md:block" />
                  <div className="md:text-right">
                    <p className="text-sm font-semibold text-slate-500">IMC</p>
                    <div className="mt-2 text-4xl font-semibold text-slate-800">24.2</div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[65%] rounded-full bg-emerald-600 shadow-[0_0_18px_rgba(34,197,94,0.28)]" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-500">
                    <span>Progreso al objetivo</span>
                    <span className="text-emerald-600">65%</span>
                  </div>
                </div>
              </article>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Siguiente comida</h2>
              <div className="mt-4 space-y-4">
                {meals.map(({ title, time, icon: Icon }) => (
                  <article key={title} className="rounded-[1.75rem] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-slate-800">{title}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                          <Clock3 className="h-4 w-4" />
                          {time}
                        </div>
                      </div>
                      <ChevronRight className="h-6 w-6 text-slate-300" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Próxima consulta</h2>
              <article className="mt-4 rounded-[1.75rem] bg-emerald-500 p-5 text-white shadow-[0_16px_40px_rgba(34,197,94,0.22)] sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                    <CalendarCheck2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">Lunes, 24 de Julio</h3>
                    <p className="mt-1 text-base font-semibold text-white/85">10:00 AM - Dra. Maria Cosio</p>
                  </div>
                </div>
              </article>
            </section>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1600px] grid-cols-5 px-2 py-2 sm:px-6 lg:px-8">
          {bottomNav.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === 'Inicio') {
                  navigate('/patient/menu')
                }
                if (label === 'Mi Plan') {
                  navigate('/patient/plan')
                }
                if (label === 'Recetas') {
                  navigate('/patient/recipes')
                }
              }}
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