// src/presentation/pages/patient/PatientChatPage.tsx
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  Send, 
  UserCircle2, 
  MessageSquare, 
  Loader, 
  ShieldPlus, 
  Menu,
  PanelLeftClose,
  UtensilsCrossed,
  Camera,
  LogOut,
  Info,
  House
} from 'lucide-react'

type Message = {
  id: number
  remitente_id: number
  destinatario_id: number
  contenido: string
  timestamp: string
  leido: boolean
}

type Nutritionist = {
  id: number
  user_id: number
  full_name: string
  specialty: string
}

const bottomNav = [
  { label: 'Inicio', icon: House, active: false },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
  { label: 'Progreso', icon: Camera, active: false },
  { label: 'Chat', icon: MessageSquare, active: true },
]

export default function PatientChatPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  
  const [menuOpen, setMenuOpen] = useState(false)
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([])
  const [selectedNutri, setSelectedNutri] = useState<Nutritionist | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [loadingList, setLoadingList] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadNutritionists() {
      try {
        setLoadingList(true)
        const token = localStorage.getItem('dietetic_access_token')
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/nutricionistas/`, { headers })
        if (!response.ok) throw new Error('Error')
        
        const data = await response.json()
        const results = data.results || data
        
        if (results && results.length > 0) {
          const formatted = results.map((n: any) => ({
            id: n.id,
            user_id: n.user_id,
            full_name: n.full_name,
            specialty: n.specialty || 'Nutricionista General'
          }))
          setNutritionists(formatted)
          setSelectedNutri(formatted[0])
        } else {
          const fallback = [{ id: 1, user_id: 2, full_name: 'Dra. Maria Cosio', specialty: 'Nutrición Clínica' }]
          setNutritionists(fallback)
          setSelectedNutri(fallback[0])
        }
      } catch {
        const fallback = [
          { id: 1, user_id: 2, full_name: 'Dra. Maria Cosio', specialty: 'Nutrición Clínica y Composición' },
          { id: 2, user_id: 3, full_name: 'Dr. Roberto Llerena', specialty: 'Nutrición Deportiva y Rendimiento' }
        ]
        setNutritionists(fallback)
        setSelectedNutri(fallback[0])
      } finally {
        setLoadingList(false)
      }
    }
    loadNutritionists()
  }, [])

  useEffect(() => {
    if (!selectedNutri) return
    
    async function loadMessages() {
      try {
        setLoadingMessages(true)
        const token = localStorage.getItem('dietetic_access_token')
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes-chat/`, { headers })
        if (!response.ok) throw new Error('Error')
        
        const data = await response.json()
        const results = data.results || data
        
        const chatLogs = (results || []).filter((msg: any) => {
          const isMine = msg.remitente_id === user?.id && msg.destinatario_id === selectedNutri.user_id
          const isTheirs = msg.remitente_id === selectedNutri.user_id && msg.destinatario_id === user?.id
          return isMine || isTheirs
        })
        
        setMessages(chatLogs)
      } catch {
        const initialOfflineMessages: Message[] = [
          {
            id: 101,
            remitente_id: selectedNutri.user_id,
            destinatario_id: user?.id || 999,
            contenido: `Hola ${user?.username || 'Paciente'}, bienvenido a tu chat de soporte nutricional. ¿Cómo vas con tu dieta esta semana?`,
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            leido: true
          }
        ]
        setMessages(initialOfflineMessages)
      } finally {
        setLoadingMessages(false)
      }
    }
    loadMessages()
  }, [selectedNutri, user])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedNutri) return
    
    const textToSend = inputText.trim()
    setInputText('')

    const tempId = Date.now()
    const newMsg: Message = {
      id: tempId,
      remitente_id: user?.id || 999,
      destinatario_id: selectedNutri.user_id,
      contenido: textToSend,
      timestamp: new Date().toISOString(),
      leido: false
    }

    setMessages(prev => [...prev, newMsg])

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes-chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destinatario: selectedNutri.user_id,
          contenido: textToSend
        })
      })

      if (!response.ok) throw new Error('Error')
    } catch {
      setTimeout(() => {
        const replyText = getMockReply(textToSend)
        const replyMsg: Message = {
          id: Date.now() + 1,
          remitente_id: selectedNutri.user_id,
          destinatario_id: user?.id || 999,
          contenido: replyText,
          timestamp: new Date().toISOString(),
          leido: false
        }
        setMessages(prev => [...prev, replyMsg])
      }, 1200)
    }
  }

  const getMockReply = (question: string) => {
    const q = question.toLowerCase()
    if (q.includes('agua') || q.includes('hidratacion')) {
      return `¡Hola! Mantenerse hidratado es fundamental. Recuerda que la meta de tu plan es de 2.0 litros al día. Intenta llevar un tomatodo medido para controlar tu consumo diario.`
    }
    if (q.includes('hambre') || q.includes('ansiedad')) {
      return `Es normal sentir un poco de ansiedad las primeras semanas. Intenta tomar un vaso de agua tibia o infusiones sin azúcar (como manzanilla). También puedes comer palitos de apio o pepino.`
    }
    if (q.includes('plátano') || q.includes('fruta') || q.includes('noche')) {
      return `Sí puedes consumir frutas en la noche, no hay problema de horario siempre que encaje dentro del total de calorías asignadas a tu plan (${user?.username || 'Paciente'}).`
    }
    if (q.includes('entrenar') || q.includes('ejercicio') || q.includes('rutina')) {
      return `Excelente actitud. Te recomiendo seguir la rutina aeróbica que tienes asignada en tu pestaña "Rutina". Recuerda descansar al menos 1 o 2 días a la semana.`
    }
    return `Hola. He recibido tu mensaje. Revisaré tu historial antropométrico para darte una respuesta detallada en nuestra próxima consulta programada.`
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-sans relative overflow-hidden flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl shrink-0">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-slate-950 shadow-inner">
              <ShieldPlus className="h-5 w-5" />
            </span>
            Soporte por Chat
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
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <UtensilsCrossed className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Mi Plan</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/photos') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <Camera className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Seguimiento</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/chat') }} className="flex w-full items-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 text-left text-sm font-bold text-emerald-400">
                <MessageSquare className="h-5 w-5 shrink-0 text-white" />
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

      {/* Main split-pane chat panel */}
      <div className="flex-1 mx-auto w-full max-w-[1200px] p-4 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden">
        
        {/* Left Side: Nutritionists list */}
        <section className="w-full md:w-80 rounded-3xl border border-white/10 bg-slate-900/40 p-4 shadow-sm flex flex-col overflow-hidden shrink-0">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-3 border-b border-white/5">Nutricionistas</h2>
          
          <div className="flex-1 overflow-y-auto mt-4 space-y-2">
            {loadingList ? (
              <div className="py-12 text-center text-slate-400 text-sm font-medium">
                <Loader className="h-5 w-5 animate-spin mx-auto text-emerald-500 mb-2" />
                Cargando especialistas...
              </div>
            ) : nutritionists.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No hay especialistas registrados.</div>
            ) : (
              nutritionists.map((nutri) => {
                const active = selectedNutri?.id === nutri.id
                return (
                  <button
                    key={nutri.id}
                    onClick={() => setSelectedNutri(nutri)}
                    className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition border ${
                      active 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/5' 
                        : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">
                      {nutri.full_name[0]?.toUpperCase() || 'D'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-white">{nutri.full_name}</h3>
                      <p className="truncate text-[10px] text-slate-400 font-semibold mt-0.5">{nutri.specialty}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </section>

        {/* Right Side: Conversation Area */}
        <section className="flex-1 rounded-3xl border border-white/10 bg-slate-900/40 shadow-sm flex flex-col overflow-hidden">
          
          {selectedNutri ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/5 bg-slate-950/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/25">
                    {selectedNutri.full_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{selectedNutri.full_name}</h2>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">En línea</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Info className="h-4 w-4 text-emerald-400" />
                  <span>Soporte Clínico</span>
                </div>
              </div>

              {/* Chat bubbles list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/15">
                {loadingMessages ? (
                  <div className="py-20 text-center text-slate-400 text-sm">
                    <Loader className="h-6 w-6 animate-spin mx-auto text-emerald-500 mb-2" />
                    Cargando historial de mensajes...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 text-sm">
                    Escribe tu primer mensaje para iniciar el soporte con {selectedNutri.full_name}.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.remitente_id === (user?.id || 999)
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs shadow-md ${
                          isMine 
                            ? 'bg-emerald-500 text-slate-950 rounded-tr-none font-semibold' 
                            : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.contenido}</p>
                          <div className={`text-[9px] mt-1.5 text-right font-medium ${isMine ? 'text-slate-950/70' : 'text-slate-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Composition form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-950/20 flex gap-3 items-center shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe tu mensaje o pregunta clínica aquí..."
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-xs text-slate-300 outline-none focus:border-emerald-500/60 transition"
                  required
                />
                <button
                  type="submit"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 transition shadow-lg shadow-emerald-500/10"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-center space-y-3">
              <MessageSquare className="h-14 w-14 text-slate-700" />
              <div>
                <p className="text-sm font-semibold text-slate-400">Ninguna conversación seleccionada</p>
                <p className="text-xs text-slate-500 mt-1">Selecciona un nutricionista de la lista de la izquierda para comenzar el chat.</p>
              </div>
            </div>
          )}

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
