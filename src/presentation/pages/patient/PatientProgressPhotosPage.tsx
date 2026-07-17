// src/presentation/pages/patient/PatientProgressPhotosPage.tsx
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePhotoStore } from '../../store/usePhotoStore'
import { API_CONFIG } from '../../../infrastructure/config/api.config'
//import { useAuthStore } from '../../store/useAuthStore'
import { 
  ArrowLeft, 
  Camera, 
  UploadCloud, 
  Image as ImageIcon, 
  AlertCircle, 
  Loader, 
  Clock, 
  Sparkles,
  FileText,
  House,
  UtensilsCrossed,
  MessageSquareText
} from 'lucide-react'

const bottomNav = [
  { label: 'Inicio', icon: House, active: false },
  { label: 'Mi Plan', icon: UtensilsCrossed, active: false },
  { label: 'Progreso', icon: Camera, active: true },
  { label: 'Chat', icon: MessageSquareText, active: false },
]

export default function PatientProgressPhotosPage() {
  const navigate = useNavigate()
  const { photos, fetchPhotos, uploadPhoto, loading, error, clearError } = usePhotoStore()

  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPhotos()
    clearError()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError()
    setUploadSuccess(false)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) {
      return
    }

    const ok = await uploadPhoto(selectedFile, description)
    if (ok) {
      setUploadSuccess(true)
      setDescription('')
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchPhotos()
    }
  }

  const getFullImageUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    const cleanBaseUrl = API_CONFIG.BASE_URL.replace('/api', '')
    return `${cleanBaseUrl}${url}`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/patient/menu')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition"
              title="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white">Fotos de Progreso</h1>
              <p className="text-[10px] text-slate-400">Historial visual de tu evolución física</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/patient/menu')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white transition">Inicio</button>
            <button onClick={() => navigate('/patient/plan')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white transition">Mi Plan</button>
            <button onClick={() => navigate('/patient/photos')} className="text-sm font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition">Progreso</button>
            <button onClick={() => navigate('/patient/chat')} className="text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white transition">Chat</button>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Camera className="h-3.5 w-3.5" />
            Control Diario
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 grid gap-8 md:grid-cols-[1.2fr_1.8fr]">
        
        {/* Upload Form */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-md shadow-sm space-y-6 self-start">
          <div>
            <h2 className="text-lg font-bold text-white">Subir Nueva Foto</h2>
            <p className="text-xs text-slate-400 mt-1">Guarda una foto de progreso físico en el servidor local del consultorio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File picker */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative cursor-pointer border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950/30 p-6 text-center hover:bg-emerald-500/5 hover:border-emerald-500/40 transition flex flex-col items-center justify-center min-h-[160px]"
            >
              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Cambiar Foto</span>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-slate-500 group-hover:text-emerald-400 transition mb-3" />
                  <p className="text-xs font-semibold text-slate-300">Haz clic para seleccionar imagen</p>
                  <p className="text-[10px] text-slate-500 mt-1">Soporta PNG, JPG o JPEG</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                required
                className="hidden" 
              />
            </div>

            <label className="block space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Descripción / Anotación</span>
              <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/30 px-4 py-3 focus-within:border-emerald-500/60 transition">
                <FileText className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej. Peso: 78.5kg. Ayuno mañana, semana 2."
                  className="w-full bg-transparent text-xs outline-none placeholder:text-slate-500 text-slate-300 resize-none leading-relaxed"
                />
              </div>
            </label>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-400 text-xs">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 text-xs font-medium">
                <Sparkles className="h-5 w-5 shrink-0" />
                <span>¡Foto subida correctamente al backend!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 font-bold text-slate-950 hover:brightness-110 disabled:opacity-40 transition shadow-md shadow-emerald-500/10"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin text-slate-950" />
              ) : (
                <>
                  <UploadCloud className="h-5 w-5" />
                  Subir al Servidor
                </>
              )}
            </button>
          </form>
        </section>

        {/* Photos Grid & Timeline */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-md shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Línea de Tiempo de Progreso</h2>
            <p className="text-xs text-slate-400 mt-1">Imágenes físicas almacenadas de forma local en tu servidor Django.</p>
          </div>

          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center space-y-3">
              <ImageIcon className="h-14 w-14 text-slate-700" />
              <div>
                <p className="text-sm font-semibold text-slate-400">Sin fotos cargadas</p>
                <p className="text-xs text-slate-500 mt-1">Comienza subiendo tu primera imagen para ver tu cambio.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {photos.map((photo) => (
                <article key={photo.id} className="rounded-2xl border border-white/5 bg-slate-950/30 overflow-hidden shadow-inner flex flex-col hover:border-emerald-500/20 transition">
                  <div className="aspect-[4/3] w-full relative bg-slate-900 overflow-hidden">
                    <img 
                      src={getFullImageUrl(photo.foto)} 
                      alt="Progreso" 
                      className="w-full h-full object-cover hover:scale-105 transition duration-500" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500'
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs font-semibold text-slate-300 italic leading-relaxed">
                      "{photo.descripcion || 'Sin anotación descriptiva'}"
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(photo.fecha_subida).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Floating Bottom Nav Dock (Extremely Premium) */}
      <nav className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-2.5 md:hidden">
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
    </div>
  )
}
