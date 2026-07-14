import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Circle, Flame, Medal, Menu, MoonStar, PanelLeftClose, ShieldPlus, Sparkles, Star, Target, UtensilsCrossed, UserCircle2 } from 'lucide-react'

type PlanTab = 'dieta' | 'rutina' | 'logros'

const planTabs: Array<{ id: PlanTab; label: string; icon: typeof UtensilsCrossed }> = [
  { id: 'dieta', label: 'Dieta', icon: UtensilsCrossed },
  { id: 'rutina', label: 'Rutina', icon: CalendarDays },
  { id: 'logros', label: 'Logros', icon: Medal },
]

const mealPlan = [
  { title: 'Desayuno', time: '08:00', detail: 'Avena con fruta y yogur', status: 'Completado' },
  { title: 'Media mañana', time: '10:30', detail: 'Fruta + semillas', status: 'Pendiente' },
  { title: 'Almuerzo', time: '13:30', detail: 'Pechuga a la plancha con ensalada', status: 'Programado' },
  { title: 'Cena', time: '19:30', detail: 'Sopa de verduras + proteína ligera', status: 'Programado' },
]

const routineDays = [
  { day: 'Lunes', activity: 'Caminar 35 min', completed: true },
  { day: 'Miércoles', activity: 'Rutina de fuerza suave', completed: false },
  { day: 'Viernes', activity: 'Cardio + estiramiento', completed: false },
]

const achievements = [
  { title: '7 días sin saltar comidas', points: '+50 pts' },
  { title: 'Meta de agua 5/7 días', points: '+30 pts' },
  { title: 'Primera consulta completada', points: '+100 pts' },
]

export default function PatientPlanPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<PlanTab>('dieta')

  const activePlan = useMemo(
    () => ({
      name: 'Plan Balance Saludable',
      calories: '1,850 kcal',
      week: 'Semana 4 de 8',
      progress: 72,
      hydration: '1.2 L / 2.0 L',
      nextConsult: 'Lunes, 24 de Julio - 10:00 AM',
    }),
    [],
  )

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
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
            Mi Plan
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-700 shadow-sm">
            J
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 transition ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <button type="button" aria-label="Cerrar menú" className={`absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 flex h-full w-[min(86vw,420px)] flex-col overflow-hidden bg-white shadow-[24px_0_60px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="relative flex min-h-[300px] flex-col justify-between bg-[linear-gradient(180deg,#4caf50_0%,#43a047_100%)] px-6 pb-8 pt-7 text-white">
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/20">
              <PanelLeftClose className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-start gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white text-emerald-600 shadow-[0_14px_30px_rgba(0,0,0,0.15)]">
                <UserCircle2 className="h-12 w-12" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white/95">john</p>
                <span className="mt-3 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/95">Paciente</span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.18))]" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <section className="mb-6">
              <h2 className="px-3 text-xs font-bold tracking-[0.28em] text-slate-300">MI SALUD</h2>
              <div className="mt-4 space-y-2">
                <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient') }} className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50">
                  <Menu className="h-6 w-6 shrink-0 text-slate-500" />
                  <span>Inicio</span>
                </button>
                <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className="flex w-full items-center gap-4 rounded-[1.5rem] bg-[#4caf50] px-4 py-3.5 text-left text-lg font-semibold text-white shadow-[0_10px_20px_rgba(76,175,80,0.22)]">
                  <UtensilsCrossed className="h-6 w-6 shrink-0 text-white" />
                  <span>Mi Plan</span>
                </button>
                <button type="button" className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50">
                  <MoonStar className="h-6 w-6 shrink-0 text-slate-500" />
                  <span>Seguimiento</span>
                </button>
              </div>
            </section>

            <section>
              <h2 className="px-3 text-xs font-bold tracking-[0.28em] text-slate-300">CONSULTAS</h2>
              <div className="mt-4 space-y-2">
                <button type="button" className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50">
                  <Star className="h-6 w-6 shrink-0 text-slate-500" />
                  <span>Chat Nutri</span>
                </button>
                <button type="button" className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50">
                  <CalendarDays className="h-6 w-6 shrink-0 text-slate-500" />
                  <span>Mis Citas</span>
                </button>
                <button type="button" className="flex w-full items-center gap-4 rounded-[1.5rem] px-4 py-3.5 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-50">
                  <UserCircle2 className="h-6 w-6 shrink-0 text-slate-500" />
                  <span>Perfil</span>
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Mi plan nutricional</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-800">Activa y sigue tu plan diario</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Aquí puedes revisar tu dieta, las rutinas y los logros asignados por tu nutricionista. La información cambia según la pestaña que selecciones.</p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100">
              <Sparkles className="h-4 w-4" />
              Plan activo
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-[1.75rem] bg-emerald-500 p-5 text-white shadow-[0_16px_40px_rgba(34,197,94,0.22)] md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/85">Plan actual</p>
                  <h2 className="text-2xl font-semibold">{activePlan.name}</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div><p className="text-sm text-white/80">Calorías</p><div className="mt-1 text-xl font-semibold">{activePlan.calories}</div></div>
                <div><p className="text-sm text-white/80">Semana</p><div className="mt-1 text-xl font-semibold">{activePlan.week}</div></div>
                <div><p className="text-sm text-white/80">Hidratación</p><div className="mt-1 text-xl font-semibold">{activePlan.hydration}</div></div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm text-white/85">
                  <span>Progreso semanal</span>
                  <span>{activePlan.progress}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: `${activePlan.progress}%` }} />
                </div>
              </div>
            </article>

            <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-500">Próxima consulta</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-500"><CalendarDays className="h-5 w-5" /></div>
                <div><h3 className="font-semibold text-slate-800">{activePlan.nextConsult}</h3><p className="mt-1 text-sm text-slate-500">Revisión de avance y ajuste de dieta.</p></div>
              </div>
            </article>

            <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-500">Meta de hoy</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500"><Flame className="h-5 w-5" /></div>
                <div><h3 className="font-semibold text-slate-800">1,850 kcal</h3><p className="mt-1 text-sm text-slate-500">Distribuidas en 4 comidas.</p></div>
              </div>
            </article>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {planTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-emerald-500 text-white shadow-[0_10px_20px_rgba(34,197,94,0.18)]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-6">
              {activeTab === 'dieta' ? (
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Tu dieta de hoy</h2>
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700">Ver detalle <ChevronRight className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-5 space-y-4">
                    {mealPlan.map((item) => (
                      <article key={item.title} className="flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm"><UtensilsCrossed className="h-5 w-5" /></div>
                        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate font-semibold text-slate-800">{item.title}</h3><span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="text-sm text-slate-500">{item.time}</span></div><p className="mt-1 text-sm text-slate-500">{item.detail}</p></div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'rutina' ? (
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Rutina semanal</h2>
                  <div className="mt-5 space-y-4">
                    {routineDays.map((item) => (
                      <article key={item.day} className="flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {item.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                          </div>
                          <div><h3 className="font-semibold text-slate-800">{item.day}</h3><p className="mt-1 text-sm text-slate-500">{item.activity}</p></div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.completed ? 'Hecho' : 'Pendiente'}</span>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'logros' ? (
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Logros desbloqueados</h2>
                  <div className="mt-5 space-y-4">
                    {achievements.map((item) => (
                      <article key={item.title} className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500"><Star className="h-5 w-5" /></div>
                          <div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-800">{item.title}</h3><p className="mt-1 text-sm text-slate-500">Recompensa obtenida en el seguimiento.</p></div>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.points}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <aside className="space-y-6">
              <article className="rounded-[1.75rem] bg-emerald-500 p-5 text-white shadow-[0_16px_40px_rgba(34,197,94,0.22)]">
                <p className="text-sm font-medium text-white/85">Acción rápida</p>
                <h2 className="mt-2 text-2xl font-semibold">Activar plan</h2>
                <p className="mt-2 text-sm leading-6 text-white/85">Si todavía no tienes un plan asignado, puedes solicitar uno desde la sección de planes disponibles.</p>
                <button type="button" onClick={() => navigate('/patient/plans')} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50">Ir a planes <ArrowRight className="h-4 w-4" /></button>
              </article>

              <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Resumen del día</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-500">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Calorías restantes</span><span className="font-semibold text-slate-800">620 kcal</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Comidas cumplidas</span><span className="font-semibold text-slate-800">1 de 4</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Meta de agua</span><span className="font-semibold text-slate-800">1.2 / 2.0 L</span></div>
                </div>
              </article>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}