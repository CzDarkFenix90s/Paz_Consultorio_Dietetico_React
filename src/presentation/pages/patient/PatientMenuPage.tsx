// src/presentation/pages/patient/PatientMenuPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { 
  Bell, 
  CalendarCheck2, 
  ChevronRight, 
  Clock3, 
  Droplets, 
  Footprints, 
  House, 
  Menu, 
  MessageSquareText, 
  PanelLeftClose, 
  ShieldPlus, 
  UtensilsCrossed, 
  UserCircle2,
  LogOut,
  Sparkles,
  Flame,
  Camera
} from 'lucide-react'

const meals = [
  {
    title: 'Almuerzo: Pechuga a la plancha con quinua',
    time: '13:30 PM',
    calories: '550 kcal',
    icon: UtensilsCrossed,
  },
]

const bottomNav = [
  { label: 'Inicio', icon: House, active: true },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
  { label: 'Progreso', icon: Footprints, active: false },
  { label: 'Chat', icon: MessageSquareText, active: false },
]

export default function PatientMenuPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Glow ambient background elements */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Premium Navbar */}
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
            Consultorio <span className="text-emerald-400">Dietético</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-slate-950">1</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-extrabold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {initialLetter}
            </button>
          </div>
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
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient') }} className="flex w-full items-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 text-left text-sm font-bold text-emerald-400">
                <House className="h-5 w-5 shrink-0" />
                <span>Inicio</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <UtensilsCrossed className="h-5 w-5 shrink-0 text-slate-400" />
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

      {/* Main Container */}
      <div className="mx-auto max-w-[1200px] px-4 pt-8 space-y-8">
        
        {/* Welcome Premium Card */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-[-30%] right-[-10%] -z-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-emerald-400 shadow-[0_8px_20px_rgba(16,185,129,0.15)]">
                <UserCircle2 className="h-10 w-10 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Bienvenido de vuelta,</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {user?.username}
                </h1>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-slate-950 transition shadow-lg shadow-rose-500/5"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Daily Summary Rings/Stats Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          
          {/* Water card with beautiful visual circular indicator */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">CONSUMO DE AGUA</p>
              <div className="text-4xl font-extrabold text-white">1.2 <span className="text-xl font-medium text-slate-400">L</span></div>
              <p className="text-xs text-slate-500 font-semibold">Meta diaria: 2.0 L</p>
            </div>
            
            {/* SVG Progress Circle */}
            <div className="relative h-20 w-20 shrink-0">
              <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-sky-500 transition-all duration-500" strokeWidth="3.2" strokeDasharray="60, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplets className="h-6 w-6 text-sky-500 animate-bounce" />
              </div>
            </div>
          </article>

          {/* Calories/Activity Summary */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">ACTIVIDAD FÍSICA</p>
              <div className="text-4xl font-extrabold text-white">Completado</div>
              <p className="text-xs text-slate-500 font-semibold">Rutina cardiovascular de hoy</p>
            </div>

            <div className="relative h-20 w-20 shrink-0">
              <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-amber-500 transition-all duration-500" strokeWidth="3.2" strokeDasharray="100, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Footprints className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </article>

        </section>

        {/* Physical Progress Dashboard */}
        <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Progreso Antropométrico</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              Recomposición
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-2">
              <p className="text-xs font-bold text-slate-400">Peso Actual</p>
              <div className="text-3xl font-extrabold text-white">78.5 <span className="text-base font-semibold text-slate-500">kg</span></div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-2">
              <p className="text-xs font-bold text-slate-400">Peso Objetivo</p>
              <div className="text-3xl font-extrabold text-white">72.0 <span className="text-base font-semibold text-slate-500">kg</span></div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-2">
              <p className="text-xs font-bold text-slate-400">Índice de Masa Corporal (IMC)</p>
              <div className="text-3xl font-extrabold text-emerald-400">24.2</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Progreso de Pérdida de Peso</span>
              <span className="text-emerald-400">65% Completado</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
            </div>
          </div>
        </section>

        {/* Meal & Next consultation Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          
          {/* Next Meal */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Siguiente Comida del Plan</h2>
            
            {meals.map((item) => (
              <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{item.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-emerald-400" /> {item.time}</span>
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-400" /> {item.calories}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600" />
              </div>
            ))}
          </article>

          {/* Consultation Alerts */}
          <article className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cita Programada</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <CalendarCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Lunes, 24 de Julio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">10:00 AM - Dra. Maria Cosio</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/patient/chat')}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-slate-950 hover:brightness-110 transition shadow-md shadow-emerald-500/10 mt-4"
            >
              <MessageSquareText className="h-4.5 w-4.5" />
              Chatear con Nutricionista
            </button>
          </article>

        </section>

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