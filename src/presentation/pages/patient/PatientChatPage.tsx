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
  user_id?: number
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
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else if (savedTheme === 'light') {
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/nutricionistas/`, { headers })
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
  const fetchChatMessages = async (nutriId: number, nutriUserId: number, isSilent = false) => {
    try {
      if (!isSilent) setLoadingMessages(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes-chat/?_t=${Date.now()}`, { headers })
      if (response.ok) {
        const data = await response.json()
        const list = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []
        const currentUserId = Number(user?.id)
        const targetNutriUserId = Number(nutriUserId || nutriId)
        
        const filtered = list.filter((m: any) => 
          (Number(m.remitente_id) === currentUserId && Number(m.destinatario_id) === targetNutriUserId) ||
          (Number(m.remitente_id) === targetNutriUserId && Number(m.destinatario_id) === currentUserId)
        )

        // Sort chronologically ascending (oldest first at top, newest at bottom)
        filtered.sort((a: any, b: any) => {
          const tA = new Date(a.timestamp || a.created_at || 0).getTime()
          const tB = new Date(b.timestamp || b.created_at || 0).getTime()
          if (tA !== tB) return tA - tB
          return (a.id || 0) - (b.id || 0)
        })

        setMessages(filtered)
      }
    } catch (error) {
      console.error('Error loading messages history:', error)
    } finally {
      if (!isSilent) setLoadingMessages(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadUserProfile()
      fetchNutritionists()
    }
  }, [user])

  // Real-time polling every 3 seconds for active conversation
  useEffect(() => {
    if (!selectedNutri) return

    const targetNutriUserId = selectedNutri.user_id || selectedNutri.id
    fetchChatMessages(selectedNutri.id, targetNutriUserId, false)

    const intervalId = setInterval(() => {
      fetchChatMessages(selectedNutri.id, targetNutriUserId, true)
    }, 3000)

    return () => clearInterval(intervalId)
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

      const targetDestId = selectedNutri.user_id || selectedNutri.id
      const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes-chat/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          destinatario: targetDestId,
          contenido: textToSend
        })
      })

      if (response.ok) {
        const newMsg = await response.json()
        setMessages(prev => [...prev, newMsg])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initialLetter = user?.username?.[0]?.toUpperCase() || 'P'
  const avatarUrlResolved = getAvatarUrl(userProfileData?.avatar_url)

  return (
    <main className={`min-h-screen pb-28 relative overflow-hidden transition-colors duration-300 selection:bg-orange-500 selection:text-white flex flex-col ${
      isDark 
        ? "bg-[#070b10] text-slate-100 font-mono crt-scanlines" 
        : "bg-[#f3f4f6] text-slate-900 font-sans"
    }`}>
      {/* Floating VHS Tape Horizontal Tracking Line Glitch */}
      {isDark && <div className="vhs-tracking-line" />}

      {/* Header */}
      <header className={`sticky top-0 z-30 px-4 py-4 backdrop-blur-md transition-colors duration-300 shrink-0 ${
        isDark ? "bg-[#070b10]/80" : "bg-[#f3f4f6]/80"
      }`}>
        <div className={`mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-2xl transition-all duration-300 ${
          isDark 
            ? "bg-[#384349] px-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] border border-[#242d32]" 
            : "bg-white px-6 shadow-sm border border-slate-200"
        }`}>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              isDark 
                ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400" 
                : "border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className={`flex items-center gap-2 text-xl font-black tracking-[0.2em] uppercase transition-colors duration-300 ${
            isDark ? "text-slate-100 vhs-text-glitch" : "text-slate-900"
          }`} style={isDark ? { filter: 'drop-shadow(0 0 6px #38bdf8)' } : {}}>
            NUTRI<span className={isDark ? "text-cyan-400" : "text-emerald-500"}>TEC</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-slate-400">
            <button onClick={() => navigate('/patient/menu')} className={`hover:${isDark ? "text-cyan-400" : "text-emerald-500"} transition`}>Inicio</button>
            <button onClick={() => navigate('/patient/plan')} className={`hover:${isDark ? "text-cyan-400" : "text-emerald-500"} transition`}>Mi Plan</button>
            <button onClick={() => navigate('/patient/recipes')} className={`hover:${isDark ? "text-cyan-400" : "text-emerald-500"} transition`}>Recetas</button>
            <button onClick={() => navigate('/patient/chat')} className={`${isDark ? "text-cyan-400 font-extrabold" : "text-emerald-500 font-bold"} transition`}>Chat</button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isDark 
                  ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-500/10" 
                  : "border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
              title="Alternar modo claro/oscuro"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-500" />}
            </button>

            <button className={`overflow-hidden flex h-10 w-10 items-center justify-center rounded-xl transition ${
              isDark 
                ? "border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]" 
                : "border border-slate-200 bg-slate-50 text-slate-500"
            } text-xs font-black`}>
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
      <div className={`fixed inset-0 z-50 transition ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <button type="button" aria-label="Cerrar menú" className={`absolute inset-0 bg-slate-950/60 backdrop-blur-[3px] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 flex h-full w-[min(86vw,420px)] flex-col overflow-hidden shadow-[24px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} ${
          isDark ? "bg-[#384349] border-r border-[#242d32]" : "bg-white border-r border-slate-200"
        }`}>
          <div className={`relative flex min-h-[260px] flex-col justify-between px-6 pb-8 pt-7 text-white ${
            isDark ? "bg-gradient-to-b from-[#242d32] to-[#1e2528]" : "bg-gradient-to-b from-emerald-950 to-slate-900"
          }`}>
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition hover:bg-white/10">
              <PanelLeftClose className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-start gap-5">
              <div className="overflow-hidden flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-cyan-400 shadow-[0_10px_25px_rgba(56,189,248,0.2)]">
                {avatarUrlResolved ? (
                  <img src={avatarUrlResolved} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 className="h-10 w-10" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider">{user?.username}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">{user?.role}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            <nav className="space-y-2.5 p-2">
              <p className="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">[MÓDULOS]</p>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/menu') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
                isDark ? "text-slate-350 hover:bg-white/5" : "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-500"
              }`}>
                <House className="h-5 w-5" /> Inicio
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/plan') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
                isDark ? "text-slate-350 hover:bg-white/5" : "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-500"
              }`}>
                <UtensilsCrossed className="h-5 w-5" /> Mi Plan
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/recipes') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
                isDark ? "text-slate-350 hover:bg-white/5" : "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-500"
              }`}>
                <ChefHat className="h-5 w-5" /> Recetas
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); navigate('/patient/chat') }} className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition ${
                isDark ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20" : "bg-emerald-500/10 text-emerald-600"
              }`}>
                <MessageSquareText className="h-5 w-5" /> Soporte
              </button>
            </nav>

            <nav className="space-y-2 p-2 pt-6 border-t border-white/5">
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 transition">
                <LogOut className="h-5 w-5" /> Cerrar sesión
              </button>
            </nav>
          </div>
        </aside>
      </div>

      {/* Main split-pane chat panel */}
      <div className="flex-1 mx-auto w-full max-w-[1200px] p-4 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden">
        
        {/* Left Side: Nutritionists list */}
        <section className={`w-full md:w-80 rounded-3xl p-4 shadow-sm flex flex-col overflow-hidden shrink-0 transition-all duration-300 border ${
          isDark 
            ? "bg-[#384349] border-4 border-[#242d32] shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]" 
            : "bg-white border-slate-200"
        }`}>
          <h2 className={`text-[10px] font-black uppercase tracking-widest px-2 pb-3 border-b ${
            isDark ? "text-slate-300 border-[#242d32]" : "text-slate-500 border-slate-100"
          }`}>[NUTRICIONISTAS]</h2>
          
          <div className="flex-1 overflow-y-auto mt-4 space-y-2">
            {loadingList ? (
              <div className="py-12 text-center text-slate-400 text-xs font-black uppercase">
                <Loader className="h-5 w-5 animate-spin mx-auto text-cyan-400 mb-2" />
                Cargando especialistas...
              </div>
            ) : nutritionists.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-black uppercase">No hay especialistas registrados.</div>
            ) : (
              nutritionists.map((nutri) => {
                const active = selectedNutri?.id === nutri.id
                return (
                  <button
                    key={nutri.id}
                    onClick={() => setSelectedNutri(nutri)}
                    className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition border ${
                      active 
                        ? (isDark ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600') 
                        : (isDark ? 'border-transparent hover:bg-white/5 text-slate-355' : 'border-transparent hover:bg-slate-500/5')
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                      isDark ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20" : "bg-emerald-500 text-white"
                    }`}>
                      {nutri.full_name[0]?.toUpperCase() || 'D'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black text-white uppercase">{nutri.full_name}</h3>
                      <p className="truncate text-[10px] text-slate-400 font-bold uppercase mt-0.5">{nutri.specialty}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </section>

        {/* Right Side: Conversation Area */}
        <section className={`flex-1 rounded-3xl shadow-sm flex flex-col overflow-hidden transition-all duration-300 border ${
          isDark 
            ? "bg-[#384349] border-4 border-[#242d32] shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]" 
            : "bg-white border-slate-200"
        }`}>
          
          {selectedNutri ? (
            <>
              {/* Header */}
              <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 transition-colors duration-300 ${
                isDark ? "bg-[#242d32] border-[#1e2528]" : "bg-input-bg border-card-border"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold border ${
                    isDark ? "bg-cyan-400/15 border-cyan-400/30 text-cyan-450" : "bg-emerald-500/25 border-emerald-500/30 text-emerald-600"
                  }`}>
                    {selectedNutri.full_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">{selectedNutri.full_name}</h2>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isDark ? "text-cyan-400" : "text-emerald-500"}`}>[EN LÍNEA]</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <Info className={`h-4 w-4 ${isDark ? "text-cyan-400" : "text-emerald-500"}`} />
                  <span>Soporte Clínico</span>
                </div>
              </div>

              {/* Chat bubbles list */}
              <div className={`flex-1 overflow-y-auto p-5 space-y-4 transition-colors duration-300 ${
                isDark ? "bg-[#1e2528]" : "bg-input-bg/10"
              }`}>
                {loadingMessages ? (
                  <div className="py-20 text-center text-slate-400 text-xs font-black uppercase">
                    <Loader className="h-6 w-6 animate-spin mx-auto text-cyan-400 mb-2" />
                    Cargando historial...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 text-xs font-black uppercase">
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
                        <div className={`max-w-[70%] rounded-xl px-4 py-3 text-xs shadow-md ${
                          isMine 
                            ? (isDark ? 'bg-cyan-500 text-slate-950 rounded-tr-none font-bold' : 'bg-emerald-500 text-slate-950 rounded-tr-none font-bold') 
                            : (isDark ? 'bg-[#384349] text-white border border-[#242d32] rounded-tl-none font-bold' : 'bg-card-bg text-slate-800 border border-slate-200 rounded-tl-none')
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.contenido}</p>
                          <div className={`text-[8px] mt-1.5 text-right font-black uppercase ${isMine ? 'text-slate-950/70' : 'text-slate-400'}`}>
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
              <form onSubmit={handleSendMessage} className={`p-4 border-t flex gap-3 items-center shrink-0 transition-colors duration-300 ${
                isDark ? "bg-[#242d32] border-[#1e2528]" : "bg-input-bg border-card-border"
              }`}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe tu mensaje o pregunta clínica aquí..."
                  className={`flex-1 rounded-xl border px-4 py-3.5 text-xs outline-none focus:border-cyan-400 transition-all ${
                    isDark 
                      ? "bg-[#384349] border-[#1e2528] text-white placeholder:text-slate-500 font-bold uppercase" 
                      : "bg-card-bg border-card-border text-slate-800 placeholder:text-slate-455"
                  }`}
                  required
                />
                <button
                  type="submit"
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition shadow-lg ${
                    isDark 
                      ? "bg-[#ff5500] hover:bg-[#e04b00] border border-orange-400 text-white btn-pixel-retro" 
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-center space-y-3">
              <MessageSquare className="h-14 w-14 text-slate-700 animate-pulse" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Ninguna conversación seleccionada</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Selecciona un nutricionista de la lista de la izquierda para comenzar el chat.</p>
              </div>
            </div>
          )}

        </section>

      </div>

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className={`fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-2xl border shadow-2xl p-2.5 md:hidden transition-all duration-300 ${
        isDark ? "border-4 border-[#242d32] bg-[#384349]/95" : "border-card-border bg-card-bg/95 backdrop-blur-xl"
      }`}>
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
              className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition ${
                active 
                  ? (isDark ? 'text-cyan-400 bg-cyan-400/10' : 'text-emerald-500 bg-emerald-500/5') 
                  : (isDark ? 'text-slate-350 hover:text-cyan-400' : 'text-slate-500 hover:text-emerald-500')
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  )
}
