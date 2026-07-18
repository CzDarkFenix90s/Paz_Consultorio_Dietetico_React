// src/presentation/pages/patient/PatientChatPage.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  Menu, 
  PanelLeftClose, 
  UtensilsCrossed, 
  ChefHat, 
  MessageSquareText, 
  LogOut, 
  House, 
  Send,
  Loader,
  MessageSquare,
  Info,
  Sun,
  Moon,
  UserCircle2
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

interface Message {
  id: number
  contenido: string
  timestamp: string
  remitente_id: number
  remitente_username: string
  destinatario_id: number
  destinatario_username: string
}

interface Specialist {
  id: number
  full_name: string
  email: string
  specialty: string
}

const bottomNav = [
  { label: 'Inicio', icon: House, active: false },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
  { label: 'Recetas', icon: ChefHat, active: false },
  { label: 'Chat', icon: MessageSquareText, active: true },
]

export default function PatientChatPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Lists & selections
  const [nutritionists, setNutritionists] = useState<Specialist[]>([])
  const [selectedNutri, setSelectedNutri] = useState<Specialist | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')

  // Loading states
  const [loadingList, setLoadingList] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
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

  // Fetch all nutritionists
  const fetchNutritionists = async () => {
    try {
      setLoadingList(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/especialistas/`, { headers })
      if (response.ok) {
        const data = await response.json()
        const list = data.results || data
        setNutritionists(list)
        if (list && list.length > 0) {
          setSelectedNutri(list[0])
        }
      }
    } catch (error) {
      console.error('Error fetching specialists list:', error)
    } finally {
      setLoadingList(false)
    }
  }

  // Fetch messages between logged-in user and selected nutritionist
  const fetchChatMessages = async (nutriId: number) => {
    try {
      setLoadingMessages(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes/historial/?con_id=${nutriId}`, { headers })
      if (response.ok) {
        const data = await response.json()
        const list = data.results || data
        setMessages(list || [])
      }
    } catch (error) {
      console.error('Error loading messages history:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadUserProfile()
      fetchNutritionists()
    }
  }, [user])

  useEffect(() => {
    if (selectedNutri) {
      fetchChatMessages(selectedNutri.id)
    }
  }, [selectedNutri])

  // Scroll to bottom when new messages loaded
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNutri || !inputText.trim() || !user) return
    const textToSend = inputText.trim()
    setInputText('')

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' }

      const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          destinatario: selectedNutri.id,
          contenido: textToSend
        })
      })

      if (response.ok) {
        const newMsg = await response.json()
        setMessages(prev => [...prev, newMsg])
        
        // Auto-reply mock fallback
        setTimeout(() => {
          const replyText = getMockReply(textToSend)
          const mockReplyMsg: Message = {
            id: Date.now() + 1,
            contenido: replyText,
            timestamp: new Date().toISOString(),
            remitente_id: selectedNutri.id,
            remitente_username: selectedNutri.full_name,
            destinatario_id: user.id,
            destinatario_username: user.username
          }
          setMessages(prev => [...prev, mockReplyMsg])
        }, 1200)
      }
    } catch (error) {
      console.error('Error sending message:', error)
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
    navigate('/')
  }

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'
  const avatarUrlResolved = getAvatarUrl(userProfileData?.avatar_url)

  return (
    <main className="min-h-screen bg-bg-main text-text-main pb-28 font-sans relative overflow-hidden flex flex-col selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-card-border bg-header-bg backdrop-blur-md transition-colors duration-300 shrink-0">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
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
            <button onClick={() => navigate('/patient/recipes')} className="hover:text-emerald-500 transition">Recetas</button>
            <button onClick={() => navigate('/patient/chat')} className="text-emerald-500 font-bold transition">Chat</button>
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

      {/* Sidebar Drawer */}
      <div className={`fixed inset-0 z-40 transition ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <button type="button" aria-label="Cerrar menú" className={`absolute inset-0 bg-slate-950/60 backdrop-blur-[3px] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 flex h-full w-[min(86vw,420px)] flex-col overflow-hidden bg-slate-900 border-r border-white/5 shadow-[24px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="relative flex min-h-[260px] flex-col justify-between bg-gradient-to-b from-emerald-950 to-slate-900 px-6 pb-8 pt-7 text-white">
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition hover:bg-white/10">
              <PanelLeftClose className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-start gap-5">
              <div className="overflow-hidden flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
                {avatarUrlResolved ? (
                  <img src={avatarUrlResolved} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 className="h-10 w-10" />
                )}
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
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/recipes') }} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 transition">
                <ChefHat className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Recetas</span>
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/chat') }} className="flex w-full items-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 text-left text-sm font-bold text-emerald-400">
                <MessageSquareText className="h-5 w-5 shrink-0" />
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
        <section className="w-full md:w-80 rounded-3xl border border-card-border bg-card-bg p-4 shadow-sm flex flex-col overflow-hidden shrink-0 transition-all duration-300">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 pb-3 border-b border-card-border">Nutricionistas</h2>
          
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
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450 shadow-sm shadow-emerald-500/5' 
                        : 'border-transparent hover:bg-slate-500/5'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">
                      {nutri.full_name[0]?.toUpperCase() || 'D'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-text-main">{nutri.full_name}</h3>
                      <p className="truncate text-[10px] text-slate-400 font-semibold mt-0.5">{nutri.specialty}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </section>

        {/* Right Side: Conversation Area */}
        <section className="flex-1 rounded-3xl border border-card-border bg-card-bg shadow-sm flex flex-col overflow-hidden transition-all duration-300">
          
          {selectedNutri ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-card-border bg-input-bg flex items-center justify-between shrink-0 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-500 font-bold border border-emerald-500/30">
                    {selectedNutri.full_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-text-main">{selectedNutri.full_name}</h2>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">En línea</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Info className="h-4 w-4 text-emerald-400" />
                  <span>Soporte Clínico</span>
                </div>
              </div>

              {/* Chat bubbles list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-input-bg/10 transition-colors duration-300">
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
                            ? 'bg-emerald-500 text-slate-950 rounded-tr-none font-bold' 
                            : 'bg-card-bg text-text-main border border-card-border rounded-tl-none transition-colors duration-300'
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
              <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border bg-input-bg flex gap-3 items-center shrink-0 transition-colors duration-300">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe tu mensaje o pregunta clínica aquí..."
                  className="flex-1 rounded-2xl border border-card-border bg-card-bg px-4 py-3.5 text-xs text-text-main outline-none focus:border-emerald-500/60 transition-all duration-300"
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
      <nav className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-3xl border border-card-border bg-card-bg/95 backdrop-blur-xl shadow-lg p-2.5 md:hidden transition-all duration-300">
        <div className="grid grid-cols-4 items-center">
          {bottomNav.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === 'Inicio') navigate('/patient/menu')
                if (label === 'Mi Plan') navigate('/patient/plan')
                if (label === 'Recetas') navigate('/patient/recipes')
                if (label === 'Chat') navigate('/patient/chat')
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition ${
                active 
                  ? 'text-emerald-500 bg-emerald-500/5' 
                  : 'text-slate-455 hover:text-emerald-500 hover:bg-slate-500/5'
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
