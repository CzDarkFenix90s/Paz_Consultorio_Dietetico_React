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
  Loader,
  Clock,
  ClipboardList
} from 'lucide-react'

type Message = {
  id: number
  remitente_id: number
  destinatario_id: number
  contenido: string
  timestamp: string
  leido: boolean
}

type TabType = 'pacientes' | 'planes' | 'chat' | 'nutricionistas' | 'alimentos' | 'categorias' | 'momentos' | 'dias' | 'detalles_alimentos' | 'facturas'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { pacientes, fetchPacientes, deletePaciente, loading: loadingPacientes, error: errorPacientes } = usePacienteStore()
  const { planes, fetchPlanes, deletePlan, loading: loadingPlanes, error: errorPlanes } = usePlanStore()

  const [activeTab, setActiveTab] = useState<TabType>('pacientes')
  const [pacienteSearch, setPacienteSearch] = useState('')
  const [pacienteStatus, setPacienteStatus] = useState('')

  // Chat states
  const [selectedPatientForChat, setSelectedPatientForChat] = useState<any | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatInputText, setChatInputText] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)

  // Clinical Sheet (Ficha Clínica) Modal for Nutritionist
  const [selectedPatientForFicha, setSelectedPatientForFicha] = useState<any | null>(null)
  const [fichaTab, setFichaTab] = useState<'evaluaciones' | 'nota' | 'objetivos' | 'sintomas' | 'ejercicios'>('evaluaciones')
  
  // Ficha Clinic Data states
  const [patientEvaluaciones, setPatientEvaluaciones] = useState<any[]>([])
  const [patientObjetivos, setPatientObjetivos] = useState<any[]>([])
  const [patientSintomas, setPatientSintomas] = useState<any[]>([])
  const [patientEjercicios, setPatientEjercicios] = useState<any[]>([])
  const [patientRutinas, setPatientRutinas] = useState<any[]>([])
  const [loadingFichaData, setLoadingFichaData] = useState(false)

  // Ficha Forms states
  const [newEvaluacion, setNewEvaluacion] = useState({ peso: '', waist: '', notes: '' })
  const [patientNoteInput, setPatientNoteInput] = useState('')
  const [newObjetivo, setNewObjetivo] = useState({ objetivo: 'BAJAR_PESO', fecha_meta: '' })
  const [newRutina, setNewRutina] = useState({ descripcion_rutina: '', dias_semana: 'Lunes, Miércoles, Viernes', duracion_minutos: '30' })

  // Admin CRUD states
  const [adminCrudData, setAdminCrudData] = useState<any[]>([])
  const [loadingCrud, setLoadingCrud] = useState(false)
  const [showCrudFormModal, setShowCrudFormModal] = useState(false)
  const [editingCrudItem, setEditingCrudItem] = useState<any | null>(null)
  const [crudFormData, setCrudFormData] = useState<Record<string, any>>({})

  // Nutricionistas list state for count badge
  const [nutricionistasList, setNutricionistasList] = useState<any[]>([])

  const fetchNutricionistasCount = async () => {
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      const res = await fetch(`${API_CONFIG.BASE_URL}/nutricionistas/?page_size=100`, { headers })
      if (res.ok) {
        const data = await res.json()
        const results = data.results || data
        setNutricionistasList(Array.isArray(results) ? results : [])
      }
    } catch (err) {
      console.error('Error fetching nutritionists count:', err)
    }
  }

  useEffect(() => {
    fetchNutricionistasCount()
  }, [])

  const isRoleAdmin = user?.role === 'admin'
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
        
        const filtered = (results || []).filter((msg: any) => {
          const isMine = msg.remitente_id === user?.id && msg.destinatario_id === selectedPatientForChat.user_id
          const isTheirs = msg.remitente_id === selectedPatientForChat.user_id && msg.destinatario_id === user?.id
          return isMine || isTheirs
        })
        
        filtered.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        setChatMessages(filtered)
      } catch {
        setChatMessages(prev => prev.length > 0 ? prev : [
          {
            id: 201,
            remitente_id: selectedPatientForChat.user_id,
            destinatario_id: user?.id || 999,
            contenido: `Hola, estuve revisando mi plan y tengo una duda sobre la porción de proteínas. ¿Puedo cambiar la pechuga de pollo por pescado blanco?`,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            leido: true
          }
        ])
      } finally {
        setLoadingChat(false)
      }
    }

    loadChatMessages(true)
    intervalId = setInterval(() => loadChatMessages(false), 5000)

    return () => clearInterval(intervalId)
  }, [activeTab, selectedPatientForChat, user])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Fetch all related clinical list data for selected patient
  const loadFichaData = async (patient: any) => {
    if (!patient) return
    try {
      setLoadingFichaData(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      
      setPatientNoteInput(patient.medical_notes || '')

      // 1. Fetch Objetivos
      const objRes = await fetch(`${API_CONFIG.BASE_URL}/objetivos-paciente/?page_size=100`, { headers })
      if (objRes.ok) {
        const objData = await objRes.json()
        const objList = objData.results || objData
        setPatientObjetivos((objList || []).filter((o: any) => o.paciente === patient.id || o.paciente_id === patient.id))
      }

      // 2. Fetch Sintomas
      const sintRes = await fetch(`${API_CONFIG.BASE_URL}/sintomas-diarios/?page_size=100`, { headers })
      if (sintRes.ok) {
        const sintData = await sintRes.json()
        const sintList = sintData.results || sintData
        setPatientSintomas((sintList || []).filter((s: any) => s.paciente === patient.id || s.paciente_id === patient.id))
      }

      // 3. Fetch Ejercicios & Rutinas
      const ejRes = await fetch(`${API_CONFIG.BASE_URL}/registros-ejercicio/?page_size=100`, { headers })
      if (ejRes.ok) {
        const ejData = await ejRes.json()
        const ejList = ejData.results || ejData
        setPatientEjercicios((ejList || []).filter((e: any) => e.paciente === patient.id || e.paciente_id === patient.id))
      }
      
      let activePlanId: number | null = null
      try {
        const subRes = await fetch(`${API_CONFIG.BASE_URL}/suscripciones/?page_size=100`, { headers })
        if (subRes.ok) {
          const subData = await subRes.json()
          const results = subData.results || subData
          const activeSub = (results || []).find(
            (s: any) => (s.paciente === patient.id || s.paciente_id === patient.id) && s.estado === 'activo'
          )
          if (activeSub) {
            activePlanId = activeSub.plan || activeSub.plan_id
          }
        }
      } catch (err) {
        console.error('Error loading subscriptions for routines:', err)
      }

      const rutRes = await fetch(`${API_CONFIG.BASE_URL}/rutinas-ejercicio/?page_size=100`, { headers })
      if (rutRes.ok) {
        const rutData = await rutRes.json()
        const rutList = rutData.results || rutData
        setPatientRutinas((rutList || []).filter(
          (r: any) => r.plan_nutricional === activePlanId || r.plan_nutricional_id === activePlanId
        ))
      }

      // 4. Fetch Paciente tracking followups
      const patRes = await fetch(`${API_CONFIG.BASE_URL}/pacientes/${patient.id}/`, { headers })
      if (patRes.ok) {
        const patData = await patRes.json()
        setPatientEvaluaciones(patData.seguimientos || [])
        setSelectedPatientForFicha(patData) // Update parent patient object to refresh details in UI!
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoadingFichaData(false)
    }
  }

  const handleOpenFicha = (patient: any) => {
    setSelectedPatientForFicha(patient)
    setFichaTab('evaluaciones')
    loadFichaData(patient)
  }

  const handleAddFollowup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatientForFicha) return
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}/pacientes/${selectedPatientForFicha.id}/add-seguimiento/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          weight_kg: Number(newEvaluacion.peso),
          waist_cm: Number(newEvaluacion.waist) || null,
          notes: newEvaluacion.notes || 'Registrado en consulta.'
        })
      })

      if (response.ok) {
        alert('Registro de seguimiento guardado con éxito.')
        setNewEvaluacion({ peso: '', waist: '', notes: '' })
        loadFichaData(selectedPatientForFicha)
        fetchPacientes()
      } else {
        const errorDetails = await response.json()
        alert('Error al guardar el seguimiento: ' + JSON.stringify(errorDetails))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveMedicalNotes = async () => {
    if (!selectedPatientForFicha) return
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}/pacientes/${selectedPatientForFicha.id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          medical_notes: patientNoteInput
        })
      })

      if (response.ok) {
        alert('Notas clínicas actualizadas con éxito.')
        selectedPatientForFicha.medical_notes = patientNoteInput
        fetchPacientes()
      } else {
        const errorData = await response.json()
        alert('Error al actualizar las notas: ' + JSON.stringify(errorData))
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al guardar notas')
    }
  }

  const handleAddObjetivo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatientForFicha) return
    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}/objetivos-paciente/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          paciente: selectedPatientForFicha.id,
          objetivo: newObjetivo.objetivo,
          fecha_inicio: new Date().toISOString().split('T')[0],
          fecha_meta: newObjetivo.fecha_meta || null,
          estado: 'PENDIENTE'
        })
      })

      if (response.ok) {
        alert('Objetivo guardado con éxito.')
        setNewObjetivo({ objetivo: 'BAJAR_PESO', fecha_meta: '' })
        loadFichaData(selectedPatientForFicha)
      } else {
        const errorData = await response.json()
        alert('Error al registrar objetivo: ' + JSON.stringify(errorData))
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al registrar objetivo')
    }
  }

  const handleAddRutina = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatientForFicha) return

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }

      // Link routine to the patient's active nutritional plan subscription
      let planId: number | null = null
      try {
        const subRes = await fetch(`${API_CONFIG.BASE_URL}/suscripciones/?page_size=100`, { headers })
        if (subRes.ok) {
          const subData = await subRes.json()
          const results = subData.results || subData
          const activeSub = (results || []).find(
            (s: any) => (s.paciente === selectedPatientForFicha.id || s.paciente_id === selectedPatientForFicha.id) && s.estado === 'activo'
          )
          if (activeSub) {
            planId = activeSub.plan || activeSub.plan_id
          }
        }
      } catch (err) {
        console.error('Error fetching subscriptions for routine save:', err)
      }

      if (!planId) {
        planId = planes[0]?.id || null
      }

      if (!planId) {
        alert('El paciente no tiene un plan activo asignado.')
        return
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/rutinas-ejercicio/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          plan_nutricional: planId,
          description: newRutina.descripcion_rutina,
          dias_semana: newRutina.dias_semana,
          duration_minutes: Number(newRutina.duracion_minutos)
        })
      })

      if (response.ok) {
        alert('Rutina de ejercicios guardada con éxito.')
        setNewRutina({ descripcion_rutina: '', dias_semana: 'Lunes, Miércoles, Viernes', duracion_minutos: '30' })
        loadFichaData(selectedPatientForFicha)
      } else {
        const errorData = await response.json()
        alert('Error al guardar la rutina: ' + JSON.stringify(errorData))
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al guardar la rutina')
    }
  }

  // Admin CRUD helper mappings
  const getEndpointForTab = (tab: TabType) => {
    if (tab === 'nutricionistas') return 'nutricionistas'
    if (tab === 'alimentos') return 'alimentos'
    if (tab === 'categorias') return 'categorias-alimentos'
    if (tab === 'momentos') return 'momentos-comida'
    if (tab === 'dias') return 'dias-plan'
    if (tab === 'detalles_alimentos') return 'detalles-alimentos-plan'
    if (tab === 'facturas') return 'facturas-pago'
    return ''
  }

  const loadCrudData = async (tab: TabType) => {
    const endpoint = getEndpointForTab(tab)
    if (!endpoint) return
    
    try {
      setLoadingCrud(true)
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/${endpoint}/?page_size=100`, { headers })
      if (response.ok) {
        const data = await response.json()
        const results = data.results || data
        setAdminCrudData(Array.isArray(results) ? results : [])
        if (tab === 'nutricionistas') {
          setNutricionistasList(Array.isArray(results) ? results : [])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCrud(false)
    }
  }

  useEffect(() => {
    const crudTabs: TabType[] = ['nutricionistas', 'alimentos', 'categorias', 'momentos', 'dias', 'detalles_alimentos', 'facturas']
    if (crudTabs.includes(activeTab)) {
      loadCrudData(activeTab)
    }
  }, [activeTab])

  const handleSaveCrudItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = getEndpointForTab(activeTab)
    if (!endpoint) return

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }

      const method = editingCrudItem ? 'PATCH' : 'POST'
      const url = editingCrudItem 
        ? `${API_CONFIG.BASE_URL}/${endpoint}/${editingCrudItem.id}/`
        : `${API_CONFIG.BASE_URL}/${endpoint}/`

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(crudFormData)
      })

      if (response.ok) {
        alert(editingCrudItem ? 'Registro actualizado con éxito.' : 'Registro creado con éxito.')
        setShowCrudFormModal(false)
        setEditingCrudItem(null)
        setCrudFormData({})
        loadCrudData(activeTab)
      } else {
        const errorDetails = await response.json()
        alert('Error: ' + JSON.stringify(errorDetails))
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al servidor')
    }
  }

  const handleDeleteCrudItem = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return
    const endpoint = getEndpointForTab(activeTab)
    if (!endpoint) return

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {}

      const response = await fetch(`${API_CONFIG.BASE_URL}/${endpoint}/${id}/`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        alert('Registro eliminado correctamente.')
        loadCrudData(activeTab)
      } else {
        alert('No se pudo eliminar el registro.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSendChatMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!chatInputText.trim() || !selectedPatientForChat) return

    try {
      const token = localStorage.getItem('dietetic_access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/mensajes-chat/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          destinatario: selectedPatientForChat.user_id,
          contenido: chatInputText.trim()
        })
      })

      if (response.ok) {
        const newMsg = await response.json()
        setChatMessages(prev => [...prev, newMsg])
        setChatInputText('')
      }
    } catch {
      // Fallback offline simulator
      const simulatorMsg: Message = {
        id: Date.now(),
        remitente_id: user?.id || 999,
        destinatario_id: selectedPatientForChat.user_id,
        contenido: chatInputText.trim(),
        timestamp: new Date().toISOString(),
        leido: false
      }
      setChatMessages(prev => [...prev, simulatorMsg])
      setChatInputText('')
    }
  }

  const handleDeletePaciente = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente de forma permanente?')) {
      await deletePaciente(id)
    }
  }

  const handleDeletePlan = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este plan nutricional?')) {
      await deletePlan(id)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans antialiased text-slate-600">
      
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Premium Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] font-black text-xl">
              N
            </span>
            <div>
              <h1 className="text-base font-black tracking-tight text-white">Panel Clínico</h1>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 font-bold">NutriTec</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-white">{user?.username}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-0.5">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-slate-950 hover:border-rose-500 transition shadow-sm"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Metric Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pacientes</p>
              <h3 className="text-2xl font-black text-white mt-1">{pacientes.length}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <BookOpen className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Planes Activos</p>
              <h3 className="text-2xl font-black text-white mt-1">{planes.filter(p => p.is_active).length}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Activity className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Calorías Promedio</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {planes.length > 0 
                  ? Math.round(planes.reduce((acc, p) => acc + Number(p.target_calories || 0), 0) / planes.length)
                  : 0} kcal
              </h3>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <MessageSquare className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mensajería</p>
              <h3 className="text-2xl font-black text-white mt-1">Activa</h3>
            </div>
          </div>
        </div>

        {/* Sidebar Nav & Main Sections */}
        <div className="grid gap-6 md:grid-cols-4 items-start">
          <aside className="md:col-span-1 space-y-4">
            <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-4 shadow-lg space-y-2">
              <p className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Módulos</p>
              
              <button
                onClick={() => { setActiveTab('pacientes'); setSelectedPatientForChat(null); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                  activeTab === 'pacientes'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Users className="h-5 w-5 shrink-0" />
                Pacientes
              </button>

              {isRoleAdmin && (
                <button
                  onClick={() => { setActiveTab('nutricionistas'); setSelectedPatientForChat(null); }}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                    activeTab === 'nutricionistas'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 shrink-0" />
                    <span>Nutricionistas</span>
                  </div>
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    activeTab === 'nutricionistas' ? 'bg-slate-950 text-emerald-400' : 'bg-white/10 text-slate-400'
                  }`}>
                    {nutricionistasList.length}
                  </span>
                </button>
              )}

              <button
                onClick={() => { setActiveTab('planes'); setSelectedPatientForChat(null); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                  activeTab === 'planes'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <BookOpen className="h-5 w-5 shrink-0" />
                Planes Nutricionales
              </button>

              <button
                onClick={() => { setActiveTab('chat'); if (pacientes.length > 0) setSelectedPatientForChat(pacientes[0]); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                  activeTab === 'chat'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <MessageSquare className="h-5 w-5 shrink-0" />
                Mensajería Pacientes
              </button>

              {/* Admin configuration endpoints links */}
              {isRoleAdmin && (
                <>
                  <p className="px-3 pt-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Administración</p>
                  
                  <button
                    onClick={() => { setActiveTab('nutricionistas'); setSelectedPatientForChat(null); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      activeTab === 'nutricionistas' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <FileSpreadsheet className="h-4 w-4 shrink-0" />
                    Reportes (Nutricionistas)
                  </button>

                  <button
                    onClick={() => { setActiveTab('alimentos'); setSelectedPatientForChat(null); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      activeTab === 'alimentos' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <ClipboardList className="h-4 w-4 shrink-0" />
                    Catálogo Alimentos
                  </button>

                  <button
                    onClick={() => { setActiveTab('categorias'); setSelectedPatientForChat(null); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      activeTab === 'categorias' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <ClipboardList className="h-4 w-4 shrink-0" />
                    Categorías Alimento
                  </button>

                  <button
                    onClick={() => { setActiveTab('momentos'); setSelectedPatientForChat(null); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      activeTab === 'momentos' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <Clock className="h-4 w-4 shrink-0" />
                    Momentos Comida
                  </button>

                  <button
                    onClick={() => { setActiveTab('dias'); setSelectedPatientForChat(null); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      activeTab === 'dias' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <Activity className="h-4 w-4 shrink-0" />
                    Días de Plan
                  </button>

                  <button
                    onClick={() => { setActiveTab('detalles_alimentos'); setSelectedPatientForChat(null); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      activeTab === 'detalles_alimentos' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <ClipboardList className="h-4 w-4 shrink-0" />
                    Detalle Alimentos Plan
                  </button>

                  <button
                    onClick={() => { setActiveTab('facturas'); setSelectedPatientForChat(null); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-semibold transition ${
                      activeTab === 'facturas' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <FileSpreadsheet className="h-4 w-4 shrink-0" />
                    Facturas de Pago
                  </button>
                </>
              )}
            </div>
          </aside>

          {/* Dynamic Content Panel */}
          <section className="md:col-span-3 space-y-6">
            
            {/* Patients Tab */}
            {activeTab === 'pacientes' && (
              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-lg space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Módulo de Pacientes</h2>
                    <p className="text-sm text-slate-400">Listado, filtros y control de historias de pacientes clínicos.</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/pacientes/nuevo')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo Paciente
                  </button>
                </div>

                {/* Filters */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-slate-950 px-3.5 py-2.5">
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar por código o nombre..."
                      value={pacienteSearch}
                      onChange={(e) => setPacienteSearch(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500 text-white"
                    />
                  </div>

                  <select
                    value={pacienteStatus}
                    onChange={(e) => setPacienteStatus(e.target.value)}
                    className="rounded-2xl border border-white/5 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-emerald-500"
                  >
                    <option value="">Todos los Estados</option>
                    <option value="activo">Activo</option>
                    <option value="en_seguimiento">En seguimiento</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {errorPacientes && (
                  <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{errorPacientes}</span>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-white/5 shadow-inner">
                  {loadingPacientes ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">Cargando pacientes...</div>
                  ) : pacientes.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">No se encontraron pacientes.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                        <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
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
                        <tbody className="divide-y divide-white/5 bg-slate-900/40">
                          {pacientes.map((paciente) => (
                            <tr key={paciente.id} className="hover:bg-white/5">
                              <td className="px-4 py-4 font-mono text-xs font-bold text-slate-400">{paciente.patient_code}</td>
                              <td className="px-4 py-4 font-semibold text-white">{paciente.full_name}</td>
                              <td className="px-4 py-4 text-slate-300">{paciente.age || 'N/A'}</td>
                              <td className="px-4 py-4 text-slate-300 truncate max-w-[120px]" title={paciente.goal}>{paciente.goal || 'Ninguno'}</td>
                              <td className="px-4 py-4 text-slate-300">
                                {paciente.bmi ? `${Number(paciente.bmi).toFixed(1)} IMC` : 'N/A'} / {paciente.current_weight ? `${paciente.current_weight} kg` : 'N/A'}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  paciente.status === 'activo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {paciente.status === 'activo' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                  {paciente.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenFicha(paciente)}
                                  className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition font-bold text-xs"
                                  title="Ficha Clínica"
                                >
                                  Ficha
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/pacientes/editar/${paciente.id}`)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-slate-400 hover:bg-white/10 hover:text-white transition"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePaciente(paciente.id)}
                                  disabled={!isRoleAdmin}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                    isRoleAdmin
                                      ? 'border-white/10 bg-slate-950 text-rose-500 hover:bg-rose-500/10'
                                      : 'border-white/5 bg-slate-950/20 text-slate-600 cursor-not-allowed'
                                  }`}
                                  title={isRoleAdmin ? "Eliminar" : "Solo Admin puede eliminar"}
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

            {/* Plans Tab */}
            {activeTab === 'planes' && (
              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-lg space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Módulo de Planes Nutricionales</h2>
                    <p className="text-sm text-slate-400">Diseña y gestiona los planes alimentarios globales.</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/planes/nuevo')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo Plan
                  </button>
                </div>

                {errorPlanes && (
                  <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{errorPlanes}</span>
                  </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-white/5 shadow-inner">
                  {loadingPlanes ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">Cargando planes...</div>
                  ) : planes.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">No se encontraron planes.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                        <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
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
                        <tbody className="divide-y divide-white/5 bg-slate-900/40">
                          {planes.map((plan) => (
                            <tr key={plan.id} className="hover:bg-white/5">
                              <td className="px-4 py-4">
                                <div className="font-semibold text-white">{plan.name}</div>
                                <div className="text-xs text-slate-400 truncate max-w-[200px]" title={plan.description}>{plan.description}</div>
                              </td>
                              <td className="px-4 py-4 text-slate-300 font-semibold">{plan.target_calories} kcal</td>
                              <td className="px-4 py-4 text-slate-300">{plan.duration_weeks} semanas</td>
                              <td className="px-4 py-4 text-slate-300 font-mono font-bold">${Number(plan.estimated_cost).toFixed(2)}</td>
                              <td className="px-4 py-4 text-slate-400 flex items-center gap-1.5">
                                <FileSpreadsheet className="h-4.5 w-4.5 text-slate-500" />
                                {plan.total_alimentos ?? 0}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  plan.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {plan.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                  {plan.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => navigate(`/admin/planes/editar/${plan.id}`)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-slate-400 hover:bg-white/10 hover:text-white transition"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePlan(plan.id)}
                                  disabled={!isRoleAdmin}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                    isRoleAdmin
                                      ? 'border-white/10 bg-slate-950 text-rose-500 hover:bg-rose-500/10'
                                      : 'border-white/5 bg-slate-950/20 text-slate-600 cursor-not-allowed'
                                  }`}
                                  title={isRoleAdmin ? "Eliminar" : "Solo Admin puede eliminar"}
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

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-4 shadow-lg flex flex-col md:flex-row gap-5 min-h-[500px]">
                {/* Contacts pane */}
                <div className="w-full md:w-64 border-r border-white/5 pr-4 flex flex-col">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3">Pacientes</h3>
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
                    {pacientes.map((p) => {
                      const active = selectedPatientForChat?.id === p.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPatientForChat(p)}
                          className={`w-full flex items-center gap-2.5 rounded-xl p-2.5 text-left text-xs font-semibold transition ${
                            active ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
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
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold">
                          {selectedPatientForChat.full_name[0]?.toUpperCase()}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{selectedPatientForChat.full_name}</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedPatientForChat.patient_code}</p>
                        </div>
                      </div>

                      {/* Chat Bubbles */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60 rounded-2xl max-h-[300px] min-h-[250px]">
                        {loadingChat ? (
                          <div className="text-center py-10 text-xs text-slate-500">
                            <Loader className="h-5 w-5 animate-spin mx-auto text-emerald-500 mb-2" />
                            Cargando chat...
                          </div>
                        ) : chatMessages.length === 0 ? (
                          <div className="text-center py-10 text-xs text-slate-500">Sin mensajes anteriores. ¡Escribe algo!</div>
                        ) : (
                          chatMessages.map((msg) => {
                            const isMine = msg.remitente_id === (user?.id || 999)
                            return (
                              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs shadow-md ${
                                  isMine ? 'bg-emerald-500 text-slate-950 rounded-tr-none font-semibold' : 'bg-slate-900 text-slate-200 rounded-tl-none border border-white/5'
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
                          placeholder="Escribe un mensaje de seguimiento clínico..."
                          className="flex-1 rounded-xl border border-white/5 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500"
                          required
                        />
                        <button
                          type="submit"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        >
                          <Send className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                      <MessageSquare className="h-10 w-10 text-slate-700" />
                      <p className="text-xs font-semibold text-slate-500">Selecciona un paciente para chatear</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Generic CRUD view case */}
            {['nutricionistas', 'alimentos', 'categorias', 'momentos', 'dias', 'detalles_alimentos', 'facturas'].includes(activeTab) && (
              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 shadow-lg space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white capitalize">Gestión de {activeTab.replace('_', ' ')}</h2>
                    <p className="text-sm text-slate-400">Ver, añadir, editar y eliminar registros de la tabla.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCrudItem(null)
                      setCrudFormData({})
                      setShowCrudFormModal(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo Registro
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/5 shadow-inner">
                  {loadingCrud ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">Cargando registros...</div>
                  ) : adminCrudData.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm font-medium">No se encontraron registros.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                        <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
                          <tr>
                            <th className="px-4 py-3.5">ID</th>
                            {activeTab === 'nutricionistas' && (
                              <>
                                <th className="px-4 py-3.5">Nombre</th>
                                <th className="px-4 py-3.5">Especialidad</th>
                                <th className="px-4 py-3.5">Tarifa</th>
                                <th className="px-4 py-3.5">Cédula</th>
                              </>
                            )}
                            {activeTab === 'alimentos' && (
                              <>
                                <th className="px-4 py-3.5">Alimento</th>
                                <th className="px-4 py-3.5">Calorías</th>
                                <th className="px-4 py-3.5">Prot / Carb / Gras</th>
                              </>
                            )}
                            {activeTab === 'categorias' && (
                              <>
                                <th className="px-4 py-3.5">Categoría</th>
                                <th className="px-4 py-3.5">Descripción</th>
                              </>
                            )}
                            {activeTab === 'momentos' && (
                              <>
                                <th className="px-4 py-3.5">Momento</th>
                                <th className="px-4 py-3.5">Orden</th>
                                <th className="px-4 py-3.5">ID Día</th>
                              </>
                            )}
                            {activeTab === 'dias' && (
                              <>
                                <th className="px-4 py-3.5">Número de Día</th>
                                <th className="px-4 py-3.5">ID Plan</th>
                              </>
                            )}
                            {activeTab === 'detalles_alimentos' && (
                              <>
                                <th className="px-4 py-3.5">Gramos Porción</th>
                                <th className="px-4 py-3.5">ID Día Plan</th>
                                <th className="px-4 py-3.5">ID Alimento</th>
                              </>
                            )}
                            {activeTab === 'facturas' && (
                              <>
                                <th className="px-4 py-3.5">Monto</th>
                                <th className="px-4 py-3.5">Estado Pago</th>
                                <th className="px-4 py-3.5">Fecha Creado</th>
                              </>
                            )}
                            <th className="px-4 py-3.5 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-slate-900/40">
                          {adminCrudData.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 text-slate-300">
                              <td className="px-4 py-4 font-mono text-xs font-bold text-slate-500">{item.id}</td>
                              
                              {activeTab === 'nutricionistas' && (
                                <>
                                  <td className="px-4 py-4 font-bold text-white">{item.first_name} {item.last_name}</td>
                                  <td className="px-4 py-4">{item.specialty}</td>
                                  <td className="px-4 py-4">${Number(item.consultation_fee).toFixed(2)}</td>
                                  <td className="px-4 py-4 font-mono text-xs">{item.professional_id}</td>
                                </>
                              )}

                              {activeTab === 'alimentos' && (
                                <>
                                  <td className="px-4 py-4 font-bold text-white">{item.name}</td>
                                  <td className="px-4 py-4">{item.calories} kcal</td>
                                  <td className="px-4 py-4 font-mono text-xs">{item.protein}g / {item.carbs}g / {item.fat}g</td>
                                </>
                              )}

                              {activeTab === 'categorias' && (
                                <>
                                  <td className="px-4 py-4 font-bold text-white">{item.name}</td>
                                  <td className="px-4 py-4 truncate max-w-[200px]" title={item.description}>{item.description || 'Sin descripción'}</td>
                                </>
                              )}

                              {activeTab === 'momentos' && (
                                <>
                                  <td className="px-4 py-4 font-bold text-white">{item.nombre_momento}</td>
                                  <td className="px-4 py-4">{item.orden}</td>
                                  <td className="px-4 py-4 font-mono text-xs">{item.dia_plan}</td>
                                </>
                              )}

                              {activeTab === 'dias' && (
                                <>
                                  <td className="px-4 py-4 font-bold text-white">Día #{item.day_number}</td>
                                  <td className="px-4 py-4 font-mono text-xs">{item.plan_nutricional}</td>
                                </>
                              )}

                              {activeTab === 'detalles_alimentos' && (
                                <>
                                  <td className="px-4 py-4 font-bold text-white">{item.portion_grams}g</td>
                                  <td className="px-4 py-4 font-mono text-xs">{item.dia_plan}</td>
                                  <td className="px-4 py-4 font-mono text-xs">{item.alimento}</td>
                                </>
                              )}

                              {activeTab === 'facturas' && (
                                <>
                                  <td className="px-4 py-4 font-mono font-bold text-white">${Number(item.monto).toFixed(2)}</td>
                                  <td className="px-4 py-4">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                      item.estado_pago === 'pagado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                      {item.estado_pago}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                                </>
                              )}

                              <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setEditingCrudItem(item)
                                    setCrudFormData(item)
                                    setShowCrudFormModal(true)
                                  }}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-slate-400 hover:bg-white/10 hover:text-white transition"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCrudItem(item.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-950 text-rose-500 hover:bg-rose-500/10 transition"
                                  title="Eliminar"
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

          </section>
        </div>
      </main>

      {/* Patient Clinical Sheet (Ficha Clínica) Modal for Nutritionist */}
      {selectedPatientForFicha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedPatientForFicha.full_name}</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                  Código: {selectedPatientForFicha.patient_code} | Edad: {selectedPatientForFicha.age || 'N/D'} años
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-semibold">
                  <span className="text-emerald-400">Peso Inicial / Actual: <strong className="text-white">{selectedPatientForFicha.current_weight ? `${selectedPatientForFicha.current_weight} kg` : 'Sin registrar'}</strong></span>
                  <span className="text-emerald-400">Estatura: <strong className="text-white">{selectedPatientForFicha.height_cm ? `${(Number(selectedPatientForFicha.height_cm) > 3 ? Number(selectedPatientForFicha.height_cm) / 100 : Number(selectedPatientForFicha.height_cm)).toFixed(2)} m` : 'Sin registrar'}</strong></span>
                  <span className="text-emerald-400">IMC: <strong className="text-white">{selectedPatientForFicha.bmi ? Number(selectedPatientForFicha.bmi).toFixed(1) : 'N/D'}</strong></span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPatientForFicha(null)}
                className="text-slate-400 hover:text-white font-black text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Row */}
            <div className="flex gap-2 border-b border-white/5 py-3 overflow-x-auto">
              <button 
                onClick={() => setFichaTab('evaluaciones')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  fichaTab === 'evaluaciones' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                Evaluaciones / Seguimiento
              </button>
              <button 
                onClick={() => setFichaTab('nota')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  fichaTab === 'nota' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                Notas Médicas
              </button>
              <button 
                onClick={() => setFichaTab('objetivos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  fichaTab === 'objetivos' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                Objetivos Paciente
              </button>
              <button 
                onClick={() => setFichaTab('sintomas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  fichaTab === 'sintomas' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                Síntomas Reportados
              </button>
              <button 
                onClick={() => setFichaTab('ejercicios')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  fichaTab === 'ejercicios' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                Rutinas & Deporte
              </button>
            </div>

            {/* Modal Tab Workspace */}
            <div className="flex-1 overflow-y-auto py-5 min-h-[300px]">
              
              {loadingFichaData ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  <Loader className="h-6 w-6 animate-spin mx-auto text-emerald-500 mb-2" />
                  Cargando información clínica...
                </div>
              ) : (
                <>
                  {/* Tab 1: Evaluaciones */}
                  {fichaTab === 'evaluaciones' && (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-4">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Historial de Pesos / Estaturas</h4>
                          <div className="overflow-hidden rounded-xl border border-white/5">
                            <table className="min-w-full text-xs text-left">
                              <thead className="bg-slate-950 text-slate-400 uppercase font-bold">
                                <tr>
                                  <th className="px-3 py-2.5">Fecha</th>
                                  <th className="px-3 py-2.5">Peso</th>
                                  <th className="px-3 py-2.5">Cintura</th>
                                  <th className="px-3 py-2.5">Observación</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-950/40 text-slate-300">
                                {patientEvaluaciones.map((ev: any) => (
                                  <tr key={ev.id}>
                                    <td className="px-3 py-2.5">{new Date(ev.created_at).toLocaleDateString()}</td>
                                    <td className="px-3 py-2.5 font-bold text-white">{ev.weight_kg} kg</td>
                                    <td className="px-3 py-2.5">{ev.waist_cm ? `${ev.waist_cm} cm` : 'N/D'}</td>
                                    <td className="px-3 py-2.5 text-slate-400">{ev.notes || 'Ninguna'}</td>
                                  </tr>
                                ))}
                                {patientEvaluaciones.length === 0 && (
                                  <tr>
                                    <td colSpan={4} className="text-center py-6 text-slate-500">Sin registros de peso.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Add Followup Form */}
                        <form onSubmit={handleAddFollowup} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nuevo Control Antropométrico</h4>
                          
                          <label className="block">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Peso (kg)</span>
                            <input 
                              type="number"
                              step="0.01"
                              required
                              value={newEvaluacion.peso}
                              onChange={e => setNewEvaluacion(prev => ({ ...prev, peso: e.target.value }))}
                              className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                            />
                          </label>

                          <label className="block">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Cintura (cm) - Opcional</span>
                            <input 
                              type="number"
                              step="0.1"
                              value={newEvaluacion.waist}
                              onChange={e => setNewEvaluacion(prev => ({ ...prev, waist: e.target.value }))}
                              className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                            />
                          </label>

                          <label className="block">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Notas</span>
                            <input 
                              type="text"
                              placeholder="Ej: Buena adherencia al plan"
                              value={newEvaluacion.notes}
                              onChange={e => setNewEvaluacion(prev => ({ ...prev, notes: e.target.value }))}
                              className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                            />
                          </label>

                          <button 
                            type="submit"
                            className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                          >
                            Registrar Control
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Nota */}
                  {fichaTab === 'nota' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Notas Clínicas y Diagnóstico</h4>
                      <p className="text-xs text-slate-400">Escribe las patologías, alergias o consideraciones médicas del paciente.</p>
                      
                      <textarea
                        value={patientNoteInput}
                        onChange={e => setPatientNoteInput(e.target.value)}
                        placeholder="Ej: Paciente con intolerancia a la lactosa leve. Objetivo principal mejorar su perfil lipídico."
                        className="w-full h-40 rounded-2xl border border-white/5 bg-slate-950 p-4 text-sm text-white outline-none focus:border-emerald-500 resize-none"
                      />

                      <button
                        onClick={handleSaveMedicalNotes}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 text-xs transition"
                      >
                        Guardar Nota Clínica
                      </button>
                    </div>
                  )}

                  {/* Tab 3: Objetivos */}
                  {fichaTab === 'objetivos' && (
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="md:col-span-2 space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Metas y Objetivos del Paciente</h4>
                        <div className="space-y-2.5">
                          {patientObjetivos.map((obj: any) => (
                            <div key={obj.id} className="p-3.5 rounded-2xl border border-white/5 bg-slate-950/40 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-bold text-white capitalize">{obj.objetivo.replace('_', ' ').toLowerCase()}</p>
                                <p className="text-[10px] text-slate-400 mt-1">Inicio: {obj.fecha_inicio} | Meta: {obj.fecha_meta || 'Sin meta'}</p>
                              </div>
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-400 uppercase tracking-widest text-[9px]">
                                {obj.estado}
                              </span>
                            </div>
                          ))}
                          {patientObjetivos.length === 0 && (
                            <p className="text-xs text-slate-500">El paciente no tiene metas registradas.</p>
                          )}
                        </div>
                      </div>

                      {/* Add Objective form */}
                      <form onSubmit={handleAddObjetivo} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nueva Meta / Objetivo</h4>
                        
                        <label className="block">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Tipo Objetivo</span>
                          <select
                            value={newObjetivo.objetivo}
                            onChange={e => setNewObjetivo(prev => ({ ...prev, objetivo: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                          >
                            <option value="BAJAR_PESO">Bajar peso</option>
                            <option value="GANAR_MASA">Ganar masa muscular</option>
                            <option value="MANTENER_PESO">Mantener peso</option>
                            <option value="REDUCIR_GRASA">Reducir grasa corporal</option>
                            <option value="MEJORAR_SALUD">Mejorar salud general</option>
                            <option value="MEJORAR_RENDIMIENTO">Mejorar rendimiento deportivo</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Fecha Limite Meta</span>
                          <input 
                            type="date"
                            required
                            value={newObjetivo.fecha_meta}
                            onChange={e => setNewObjetivo(prev => ({ ...prev, fecha_meta: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                          />
                        </label>

                        <button 
                          type="submit"
                          className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                        >
                          Crear Objetivo
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Tab 4: Síntomas */}
                  {fichaTab === 'sintomas' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Historial de Síntomas Reportados</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {patientSintomas.map((s: any) => (
                          <div key={s.id} className="p-4 rounded-2xl border border-white/5 bg-slate-950/40 text-xs space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white capitalize">{s.sintoma.replace('_', ' ').toLowerCase()}</span>
                              <span className="text-[10px] text-slate-400">{s.fecha}</span>
                            </div>
                            <p className="text-slate-300 italic">"{s.notas || 'Sin notas del paciente'}"</p>
                          </div>
                        ))}
                        {patientSintomas.length === 0 && (
                          <p className="text-xs text-slate-500">No hay registros de síntomas reportados.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 5: Ejercicios */}
                  {fichaTab === 'ejercicios' && (
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="md:col-span-2 space-y-5">
                        
                        {/* Rutinas */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rutinas Asignadas</h4>
                          <div className="space-y-2">
                            {patientRutinas.map((r: any) => (
                              <div key={r.id} className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 text-xs flex justify-between items-start">
                                <div>
                                  <p className="font-bold text-white">{r.description || r.descripcion_rutina}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">Días: {r.dias_semana} | Duración: {r.duration_minutes || r.duracion_minutos} min</p>
                                </div>
                              </div>
                            ))}
                            {patientRutinas.length === 0 && (
                              <p className="text-xs text-slate-500">Sin rutinas de entrenamiento asignadas.</p>
                            )}
                          </div>
                        </div>

                        {/* Logs */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Registro de Ejercicios Completados</h4>
                          <div className="overflow-hidden rounded-xl border border-white/5">
                            <table className="min-w-full text-xs text-left">
                              <thead className="bg-slate-950 text-slate-400 font-bold uppercase">
                                <tr>
                                  <th className="px-3 py-2">Fecha</th>
                                  <th className="px-3 py-2">Rutina</th>
                                  <th className="px-3 py-2">Completado</th>
                                  <th className="px-3 py-2">Notas</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-950/40 text-slate-300">
                                {patientEjercicios.map((e: any) => (
                                  <tr key={e.id}>
                                    <td className="px-3 py-2">{e.fecha}</td>
                                    <td className="px-3 py-2 font-bold text-white">{e.rutina_ejercicio_id}</td>
                                    <td className="px-3 py-2">{e.completado ? '✅ Sí' : '❌ No'}</td>
                                    <td className="px-3 py-2 text-slate-400">{e.notas}</td>
                                  </tr>
                                ))}
                                {patientEjercicios.length === 0 && (
                                  <tr>
                                    <td colSpan={4} className="text-center py-4 text-slate-500">Sin registros de ejecución.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>

                      {/* Add Routine form */}
                      <form onSubmit={handleAddRutina} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 space-y-3 h-fit">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Asignar Nueva Rutina</h4>
                        
                        <label className="block">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Descripción</span>
                          <input 
                            type="text"
                            required
                            placeholder="Ej: Rutina de fuerza tren superior"
                            value={newRutina.descripcion_rutina}
                            onChange={e => setNewRutina(prev => ({ ...prev, descripcion_rutina: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Días de la semana</span>
                          <input 
                            type="text"
                            required
                            value={newRutina.dias_semana}
                            onChange={e => setNewRutina(prev => ({ ...prev, dias_semana: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Duración (minutos)</span>
                          <input 
                            type="number"
                            required
                            value={newRutina.duracion_minutos}
                            onChange={e => setNewRutina(prev => ({ ...prev, duracion_minutos: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                          />
                        </label>

                        <button 
                          type="submit"
                          className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                        >
                          Asignar Rutina
                        </button>
                      </form>
                    </div>
                  )}

                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Admin Generic CRUD Add/Edit Modal */}
      {showCrudFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white capitalize">
                {editingCrudItem ? 'Editar' : 'Añadir'} {activeTab.slice(0, -1)}
              </h3>
              <button 
                onClick={() => setShowCrudFormModal(false)}
                className="text-slate-400 hover:text-white font-black text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCrudItem} className="space-y-4">
              
              {activeTab === 'nutricionistas' && (
                <>
                  <div className="grid gap-3 grid-cols-2">
                    <label className="block">
                      <span className="text-xs text-slate-400">Nombre</span>
                      <input 
                        type="text"
                        required
                        value={crudFormData.first_name || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Apellido</span>
                      <input 
                        type="text"
                        required
                        value={crudFormData.last_name || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs text-slate-400">Especialidad</span>
                    <input 
                      type="text"
                      required
                      value={crudFormData.specialty || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, specialty: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <div className="grid gap-3 grid-cols-2">
                    <label className="block">
                      <span className="text-xs text-slate-400">Cédula Profesional</span>
                      <input 
                        type="text"
                        required
                        value={crudFormData.professional_id || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, professional_id: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Tarifa Consulta ($)</span>
                      <input 
                        type="number"
                        required
                        value={crudFormData.consultation_fee || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, consultation_fee: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                  </div>
                </>
              )}

              {activeTab === 'alimentos' && (
                <>
                  <label className="block">
                    <span className="text-xs text-slate-400">Nombre del Alimento</span>
                    <input 
                      type="text"
                      required
                      value={crudFormData.name || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <div className="grid gap-3 grid-cols-4">
                    <label className="block">
                      <span className="text-xs text-slate-400">Calorías</span>
                      <input 
                        type="number"
                        required
                        value={crudFormData.calories || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, calories: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Prot (g)</span>
                      <input 
                        type="number"
                        required
                        value={crudFormData.protein || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, protein: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Carbs (g)</span>
                      <input 
                        type="number"
                        required
                        value={crudFormData.carbs || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, carbs: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Grasas (g)</span>
                      <input 
                        type="number"
                        required
                        value={crudFormData.fat || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, fat: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                  </div>
                </>
              )}

              {activeTab === 'categorias' && (
                <>
                  <label className="block">
                    <span className="text-xs text-slate-400">Nombre de la Categoría</span>
                    <input 
                      type="text"
                      required
                      value={crudFormData.name || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Descripción</span>
                    <textarea 
                      value={crudFormData.description || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500 h-24 resize-none"
                    />
                  </label>
                </>
              )}

              {activeTab === 'momentos' && (
                <>
                  <label className="block">
                    <span className="text-xs text-slate-400">ID Día Plan</span>
                    <input 
                      type="number"
                      required
                      value={crudFormData.dia_plan || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, dia_plan: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Nombre del Momento</span>
                    <input 
                      type="text"
                      required
                      placeholder="Ej: Desayuno, Almuerzo"
                      value={crudFormData.nombre_momento || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, nombre_momento: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Orden</span>
                    <input 
                      type="number"
                      required
                      value={crudFormData.orden || '1'}
                      onChange={e => setCrudFormData(prev => ({ ...prev, orden: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                </>
              )}

              {activeTab === 'dias' && (
                <>
                  <label className="block">
                    <span className="text-xs text-slate-400">ID Plan Nutricional</span>
                    <input 
                      type="number"
                      required
                      value={crudFormData.plan_nutricional || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, plan_nutricional: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Número de Día</span>
                    <input 
                      type="number"
                      required
                      value={crudFormData.day_number || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, day_number: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                </>
              )}

              {activeTab === 'detalles_alimentos' && (
                <>
                  <label className="block">
                    <span className="text-xs text-slate-400">Gramos Porción</span>
                    <input 
                      type="number"
                      required
                      value={crudFormData.portion_grams || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, portion_grams: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <div className="grid gap-3 grid-cols-2">
                    <label className="block">
                      <span className="text-xs text-slate-400">ID Día Plan</span>
                      <input 
                        type="number"
                        required
                        value={crudFormData.dia_plan || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, dia_plan: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">ID Alimento</span>
                      <input 
                        type="number"
                        required
                        value={crudFormData.alimento || ''}
                        onChange={e => setCrudFormData(prev => ({ ...prev, alimento: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </label>
                  </div>
                </>
              )}

              {activeTab === 'facturas' && (
                <>
                  <label className="block">
                    <span className="text-xs text-slate-400">Monto Factura ($)</span>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={crudFormData.monto || ''}
                      onChange={e => setCrudFormData(prev => ({ ...prev, monto: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-400">Estado de Pago</span>
                    <select
                      value={crudFormData.estado_pago || 'pendiente'}
                      onChange={e => setCrudFormData(prev => ({ ...prev, estado_pago: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                      <option value="anulado">Anulado</option>
                    </select>
                  </label>
                </>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 transition"
              >
                Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
