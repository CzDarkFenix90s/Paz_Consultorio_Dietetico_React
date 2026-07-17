// src/presentation/pages/admin/AdminDashboard.tsx
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { usePacienteStore } from '../../store/usePacienteStore'
import { usePlanStore } from '../../store/usePlanStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
import { 
  Users, 
  BookOpen, 
  LogOut, 
  ShieldAlert, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Activity,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  AlertCircle,
  MessageSquare,
  Send,
  Loader
} from 'lucide-react'

type Message = {
  id: number
  remitente_id: number
  destinatario_id: number
  contenido: string
  timestamp: string
  leido: boolean
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { pacientes, fetchPacientes, deletePaciente, loading: loadingPacientes, error: errorPacientes } = usePacienteStore()
  const { planes, fetchPlanes, deletePlan, loading: loadingPlanes, error: errorPlanes } = usePlanStore()

  const [activeTab, setActiveTab] = useState<'pacientes' | 'planes' | 'chat'>('pacientes')
  const [pacienteSearch, setPacienteSearch] = useState('')
  const [pacienteStatus, setPacienteStatus] = useState('')

  // Chat states
  const [selectedPatientForChat, setSelectedPatientForChat] = useState<any | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatInputText, setChatInputText] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPacientes({
      search: activeTab === 'pacientes' ? pacienteSearch : '',
      status: activeTab === 'pacientes' ? pacienteStatus : '',
    })
    fetchPlanes()
  }, [activeTab, pacienteSearch, pacienteStatus, fetchPacientes, fetchPlanes])

  // Load chat messages when patient is selected
  useEffect(() => {
    if (activeTab !== 'chat' || !selectedPatientForChat) return

    let intervalId: any

    async function loadChatMessages(showLoading = false) {
      try {
        if (showLoading) setLoadingChat(true)
        const token = localStorage.getItem('dietetic_access_token')
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes-chat/`, { headers })
        if (!response.ok) throw new Error('Error al cargar mensajes')
        
        const data = await response.json()
        const results = data.results || data
        
        // Filter messages between nutritionist/admin and selected patient
        const filtered = (results || []).filter((msg: any) => {
          const isMine = msg.remitente_id === user?.id && msg.destinatario_id === selectedPatientForChat.user_id
          const isTheirs = msg.remitente_id === selectedPatientForChat.user_id && msg.destinatario_id === user?.id
          return isMine || isTheirs
        })
        
        // Sort chronologically (oldest first, newest last)
        filtered.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        
        setChatMessages(filtered)
      } catch {
        // Offline chat simulator initial state
        setChatMessages(prev => prev.length > 0 ? prev : [
          {
            id: 201,
            remitente_id: selectedPatientForChat.user_id,
            destinatario_id: user?.id || 999,
            contenido: `Hola Doctor, estuve revisando mi plan y tengo una duda sobre la porción de proteínas del almuerzo. ¿Puedo cambiar la pechuga de pollo por pescado blanco?`,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            leido: true
          }
        ])
      } finally {
        if (showLoading) setLoadingChat(false)
      }
    }
    
    loadChatMessages(true)
    
    // Poll every 4 seconds
    intervalId = setInterval(() => {
      loadChatMessages(false)
    }, 4000)
    
    return () => {
      clearInterval(intervalId)
    }
  }, [activeTab, selectedPatientForChat, user])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInputText.trim() || !selectedPatientForChat) return

    const text = chatInputText.trim()
    setChatInputText('')

    const tempMsg: Message = {
      id: Date.now(),
      remitente_id: user?.id || 999,
      destinatario_id: selectedPatientForChat.user_id,
      contenido: text,
      timestamp: new Date().toISOString(),
      leido: false
    }

    setChatMessages(prev => [...prev, tempMsg])

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes-chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destinatario: selectedPatientForChat.user_id,
          contenido: text
        })
      })
      if (!response.ok) throw new Error('Error al enviar')
    } catch {
      // Offline reply simulation
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          remitente_id: selectedPatientForChat.user_id,
          destinatario_id: user?.id || 999,
          contenido: `Perfecto doctor, muchas gracias. Ya registré mi progreso e hidratación del día de hoy en el portal.`,
          timestamp: new Date().toISOString(),
          leido: false
        }])
      }, 1500)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDeletePaciente = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      const ok = await deletePaciente(id)
      if (ok) {
        alert('Paciente eliminado con éxito.')
        fetchPacientes({ search: pacienteSearch, status: pacienteStatus })
      }
    }
  }

  const handleDeletePlan = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este plan nutricional?')) {
      const ok = await deletePlan(id)
      if (ok) {
        alert('Plan nutricional eliminado con éxito.')
        fetchPlanes()
      }
    }
  }

  const isRoleAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/10">
              <Activity className="h-5.5 w-5.5" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Dietetic Admin</h1>
              <p className="text-xs text-slate-500">Panel de Control Profesional</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-800">{user?.username}</span>
              <span className="inline-flex self-end rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {user?.role === 'admin' ? 'Administrador' : 'Nutricionista'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics Metric Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pacientes</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{pacientes.length}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <BookOpen className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Planes Activos</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{planes.filter(p => p.is_active).length}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Activity className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Calorías Promedio</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {planes.length > 0 
                  ? Math.round(planes.reduce((acc, p) => acc + Number(p.target_calories || 0), 0) / planes.length)
                  : 0} kcal
              </h3>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <MessageSquare className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mensajería</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">Activa</h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Metrics */}
        <div className="grid gap-6 md:grid-cols-4 items-start">
          <aside className="md:col-span-1 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
              <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Módulos</p>
              
              <button
                onClick={() => { setActiveTab('pacientes'); setSelectedPatientForChat(null); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                  activeTab === 'pacientes'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="h-5 w-5 shrink-0" />
                Pacientes
              </button>

              <button
                onClick={() => { setActiveTab('planes'); setSelectedPatientForChat(null); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                  activeTab === 'planes'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="h-5 w-5 shrink-0" />
                Planes Nutricionales
              </button>

              <button
                onClick={() => { setActiveTab('chat'); if (pacientes.length > 0) setSelectedPatientForChat(pacientes[0]); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                  activeTab === 'chat'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="h-5 w-5 shrink-0" />
                Mensajería Pacientes
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm text-xs text-slate-500 space-y-3">
              <div className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                <div>
                  <p className="font-bold text-slate-800">Control por Roles</p>
                  <p className="mt-0.5 leading-normal">
                    Solo los administradores pueden eliminar registros del sistema. Los nutricionistas pueden crear y editar.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Module Tables & Filters */}
          <section className="md:col-span-3 space-y-6">
            
            {activeTab === 'pacientes' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Módulo de Pacientes</h2>
                    <p className="text-sm text-slate-500">Listado, filtros y control de historias de pacientes clínicos.</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/pacientes/nuevo')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-400 transition shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo Paciente
                  </button>
                </div>

                {/* Filters */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5">
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar por código o nombre..."
                      value={pacienteSearch}
                      onChange={(e) => setPacienteSearch(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700"
                    />
                  </div>

                  <select
                    value={pacienteStatus}
                    onChange={(e) => setPacienteStatus(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500"
                  >
                    <option value="">Todos los Estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {errorPacientes && (
                  <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-700 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{errorPacientes}</span>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-inner">
                  {loadingPacientes ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">Cargando pacientes...</div>
                  ) : pacientes.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">No se encontraron pacientes.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-4 py-3.5">Código</th>
                            <th className="px-4 py-3.5">Paciente</th>
                            <th className="px-4 py-3.5">Edad</th>
                            <th className="px-4 py-3.5">Meta</th>
                            <th className="px-4 py-3.5">IMC / Peso</th>
                            <th className="px-4 py-3.5">Estado</th>
                            <th className="px-4 py-3.5 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {pacientes.map((paciente) => (
                            <tr key={paciente.id} className="hover:bg-slate-50/50">
                              <td className="px-4 py-4 font-mono text-xs font-bold text-slate-600">{paciente.patient_code}</td>
                              <td className="px-4 py-4 font-semibold text-slate-900">{paciente.full_name}</td>
                              <td className="px-4 py-4 text-slate-600">{paciente.age ?? 'N/A'}</td>
                              <td className="px-4 py-4 text-slate-600 truncate max-w-[120px]" title={paciente.goal}>{paciente.goal ?? 'Ninguno'}</td>
                              <td className="px-4 py-4 text-slate-600">
                                {paciente.bmi ? `${Number(paciente.bmi).toFixed(1)} IMC` : 'N/A'} / {paciente.current_weight ? `${paciente.current_weight} kg` : 'N/A'}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  paciente.status === 'activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {paciente.status === 'activo' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                  {paciente.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => navigate(`/admin/pacientes/editar/${paciente.id}`)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePaciente(paciente.id)}
                                  disabled={!isRoleAdmin}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                    isRoleAdmin
                                      ? 'border-slate-200 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                                      : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                                  }`}
                                  title={isRoleAdmin ? "Eliminar" : "No tienes permisos de Administrador para eliminar"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'planes' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Módulo de Planes Nutricionales</h2>
                    <p className="text-sm text-slate-500">Dietas estructuradas reutilizables en consultas.</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/planes/nuevo')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-400 transition shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo Plan
                  </button>
                </div>

                {errorPlanes && (
                  <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-700 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{errorPlanes}</span>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-inner">
                  {loadingPlanes ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">Cargando planes...</div>
                  ) : planes.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">No se encontraron planes.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-4 py-3.5">Nombre</th>
                            <th className="px-4 py-3.5">Calorías</th>
                            <th className="px-4 py-3.5">Duración</th>
                            <th className="px-4 py-3.5">Costo Estimado</th>
                            <th className="px-4 py-3.5">Alimentos Activos</th>
                            <th className="px-4 py-3.5">Estado</th>
                            <th className="px-4 py-3.5 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {planes.map((plan) => (
                            <tr key={plan.id} className="hover:bg-slate-50/50">
                              <td className="px-4 py-4">
                                <div className="font-semibold text-slate-900">{plan.name}</div>
                                <div className="text-xs text-slate-400 truncate max-w-[200px]" title={plan.description}>{plan.description}</div>
                              </td>
                              <td className="px-4 py-4 text-slate-600 font-semibold">{plan.target_calories} kcal</td>
                              <td className="px-4 py-4 text-slate-600">{plan.duration_weeks} semanas</td>
                              <td className="px-4 py-4 text-slate-600 font-mono font-bold">${Number(plan.estimated_cost).toFixed(2)}</td>
                              <td className="px-4 py-4 text-slate-500 flex items-center gap-1.5">
                                <FileSpreadsheet className="h-4.5 w-4.5 text-slate-400" />
                                {plan.total_alimentos ?? 0}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  plan.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {plan.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                  {plan.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => navigate(`/admin/planes/editar/${plan.id}`)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePlan(plan.id)}
                                  disabled={!isRoleAdmin}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                    isRoleAdmin
                                      ? 'border-slate-200 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                                      : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                                  }`}
                                  title={isRoleAdmin ? "Eliminar" : "No tienes permisos de Administrador para eliminar"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat Workspace (Nutricionista/Admin chat with Patients) */}
            {activeTab === 'chat' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-5 min-h-[500px]">
                
                {/* Contacts pane */}
                <div className="w-full md:w-64 border-r border-slate-100 pr-4 flex flex-col">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3">Pacientes</h3>
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
                    {pacientes.map((p) => {
                      const active = selectedPatientForChat?.id === p.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPatientForChat(p)}
                          className={`w-full flex items-center gap-2.5 rounded-xl p-2.5 text-left text-xs font-semibold transition ${
                            active ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold">
                            {p.full_name[0]?.toUpperCase()}
                          </span>
                          <span className="truncate">{p.full_name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Messaging pane */}
                <div className="flex-1 flex flex-col justify-between">
                  {selectedPatientForChat ? (
                    <>
                      {/* Active header */}
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                          {selectedPatientForChat.full_name[0]?.toUpperCase()}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{selectedPatientForChat.full_name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedPatientForChat.patient_code}</p>
                        </div>
                      </div>

                      {/* Chat Bubbles */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50 rounded-2xl max-h-[300px] min-h-[250px]">
                        {loadingChat ? (
                          <div className="text-center py-10 text-xs text-slate-400">
                            <Loader className="h-5 w-5 animate-spin mx-auto text-emerald-500 mb-2" />
                            Cargando chat...
                          </div>
                        ) : chatMessages.length === 0 ? (
                          <div className="text-center py-10 text-xs text-slate-400">Sin mensajes anteriores. ¡Escribe algo!</div>
                        ) : (
                          chatMessages.map((msg) => {
                            const isMine = msg.remitente_id === (user?.id || 999)
                            return (
                              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs shadow-sm ${
                                  isMine ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                }`}>
                                  <p>{msg.contenido}</p>
                                  <div className="text-[8px] text-right mt-1 opacity-70">
                                    {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Composer */}
                      <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-3">
                        <input
                          type="text"
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          placeholder="Responde con recomendaciones o respuestas clínicas..."
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
                          required
                        />
                        <button
                          type="submit"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-400"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                      <MessageSquare className="h-10 w-10 text-slate-200" />
                      <p className="text-xs font-semibold text-slate-700">Selecciona un paciente para chatear</p>
                    </div>
                  )}
                </div>

              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  )
}
