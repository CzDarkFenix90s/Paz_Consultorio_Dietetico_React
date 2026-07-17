import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  MapPin,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react'

// Helper to resolve media files from Django backend
const getMediaUrl = (path: string) => {
  if (import.meta.env.PROD) {
    return `/media/${path}`
  }
  return `http://localhost:8000/media/${path}`
}

// Custom Video Player that falls back gracefully to a poster image if not found on the backend
function VideoWithFallback({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (hasError || !src) {
    return (
      <img 
        src={poster} 
        alt="Visual" 
        className={`${className} object-cover`}
      />
    )
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      onError={() => {
        console.warn(`Video failed to load: ${src}. Using poster fallback.`);
        setHasError(true)
      }}
      className={`${className} object-cover`}
    />
  )
}

function FadeInProjectSection({ number, title, subtitle, videoName, posterSrc }: any) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.15 }
    )
    if (domRef.current) {
      observer.observe(domRef.current)
    }
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current)
      }
    }
  }, [])

  const videoUrl = getMediaUrl(`videos/${videoName}`)

  return (
    <div 
      ref={domRef}
      className={`transition-all duration-[1200ms] ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-[0.97]'
      } flex flex-col md:flex-row items-center gap-8 border-b border-emerald-500/10 py-20`}
    >
      {/* Left Index */}
      <div className="hidden md:block w-16 text-left text-sm font-extrabold text-emerald-400 tracking-wider">
        {number}
      </div>

      {/* Widescreen Video Card Container */}
      <div className="flex-1 relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 group">
        <VideoWithFallback 
          src={videoUrl}
          poster={posterSrc}
          className="w-full h-full opacity-60 group-hover:opacity-85 transition-opacity duration-700 ease-out"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-between p-8">
          <div className="text-[10px] font-bold text-emerald-400 tracking-[0.25em] uppercase">
            {subtitle}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
              {title}
            </h3>
            <p className="text-[10px] text-teal-300 tracking-wider uppercase font-medium">
              NutriTec Consultorio Inteligente
            </p>
          </div>
        </div>
      </div>

      {/* Right Action Button */}
      <div className="w-24 text-right">
        <Link 
          to="/register"
          className="inline-block rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider px-6 py-3 transition shadow-lg shadow-emerald-500/15 uppercase"
        >
          Ver
        </Link>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const heroVideoUrl = getMediaUrl('videos/hero_loop.mp4')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Premium Navbar Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-black text-lg">
              N
            </span>
            Nutri<span className="text-emerald-400">Tec</span>
          </Link>
          
          {/* Menu Links */}
          <nav className="hidden items-center gap-8 md:flex text-sm font-medium text-slate-400">
            <a href="#beneficios" className="hover:text-white transition">Beneficios</a>
            <a href="#servicios" className="hover:text-white transition">Servicios</a>
            <a href="#contacto" className="hover:text-white transition">Contacto</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-white hover:text-emerald-400 transition">
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-[0_0_25px_rgba(16,185,129,0.2)]"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded border border-white/10 text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-white">Nutri<span className="text-emerald-400">Tec</span></span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 w-10 flex items-center justify-center rounded border border-white/10 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-8 text-2xl font-bold text-slate-300 my-auto">
            <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">Beneficios</a>
            <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">Servicios</a>
            <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">Contacto</a>
          </nav>

          <div className="flex flex-col gap-4 text-center text-sm">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="border border-white/10 py-3 text-slate-400 hover:text-white rounded-full">
              Iniciar Sesión
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-emerald-500 py-3 text-slate-950 font-bold rounded-full">
              Registrarse
            </Link>
          </div>
        </div>
      )}

      {/* Cinematic Fullscreen Background Hero */}
      <section className="relative h-[90vh] flex items-center border-b border-white/5">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <VideoWithFallback 
            src={heroVideoUrl}
            poster="/assets/patient_banner.png"
            className="w-full h-full opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="max-w-4xl space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-400">
              Tu salud inteligente empieza hoy
            </span>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.95]">
              Alcanza tu mejor versión con <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                planes nutricionales
              </span> a tu medida.
            </h1>

            <p className="text-lg leading-relaxed text-slate-400 max-w-2xl">
              En nuestro Consultorio Dietético fusionamos la ciencia de la nutrición con tecnología intuitiva para crear planes alimenticios personalizados que realmente se adapten a tu estilo de vida.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-full text-sm font-bold transition shadow-lg shadow-emerald-500/25 uppercase flex items-center gap-2"
              >
                Comienza Gratis <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#servicios"
                className="border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-full text-sm font-bold transition uppercase"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Widescreen Portfolio Section */}
      <section id="servicios" className="py-24 border-b border-white/5 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Nuestros Servicios
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase sm:text-5xl leading-none">
              Soluciones Clínicas y Deportivas
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Explora las herramientas diseñadas para guiar tu cambio de hábitos de forma visual, profesional e interactiva.
            </p>
          </div>

          {/* Fade-in widescreen video items with IntersectionObserver */}
          <div className="space-y-6">
            <FadeInProjectSection 
              number="01"
              title="DIETAS MOLECULARES"
              subtitle="Cálculo analítico de macronutrientes"
              videoName="service_diet.mp4"
              posterSrc="/assets/service_diet.png"
            />
            <FadeInProjectSection 
              number="02"
              title="EVOLUCIÓN ANTROPOMÉTRICA"
              subtitle="Control diario y composición corporal"
              videoName="service_progress.mp4"
              posterSrc="/assets/service_gym.png"
            />
            <FadeInProjectSection 
              number="03"
              title="RECETARIO INDUSTRIAL"
              subtitle="Instrucciones en video y porciones exactas"
              videoName="service_recipes.mp4"
              posterSrc="/assets/service_recipe.png"
            />
          </div>

        </div>
      </section>

      {/* Benefits Specifications Section */}
      <section id="beneficios" className="py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Por qué elegirnos
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase sm:text-5xl leading-none">
              Tu bienestar, estructurado y bajo control
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { number: '01', title: 'NUTRICIÓN CIENTÍFICA', desc: 'Planes validados por profesionales basados en evaluaciones clínicas y antropométricas.' },
              { number: '02', title: 'PLATAFORMA INTERACTIVA', desc: 'Acceso privado para registrar tu consumo de agua, comidas y síntomas diarios.' },
              { number: '03', title: 'PANEL DE ESPECIALISTAS', desc: 'Asignación de nutricionistas dedicados que controlan y editan tus rutinas y dietas.' },
              { number: '04', title: 'CONTROL DE ALIMENTOS', desc: 'Catálogos y categorías estructuradas para evitar la desorganización de ingredientes.' },
              { number: '05', title: 'SEGURIDAD JWT', desc: 'Autenticación encriptada para mantener tu historial clínico e información de salud 100% privada.' },
              { number: '06', title: 'EVIDENCIA VISUAL', desc: 'Sube fotos de tu progreso directamente a nuestro servidor de manera totalmente privada.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 hover:border-emerald-500/20 hover:bg-white/[0.03] transition duration-300">
                <div className="text-[10px] font-bold text-emerald-400">{item.number} // PARÁMETRO</div>
                <h3 className="text-lg font-bold text-white mt-4 uppercase">{item.title}</h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action & Contact */}
      <section id="contacto" className="py-24 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase sm:text-5xl leading-none">
                ¿Tienes dudas? <br />
                Ponte en contacto
              </h2>
              <p className="text-lg text-slate-400">
                Estamos aquí para acompañarte en tu transformación física y alimentaria. Escríbenos o visítanos en nuestro consultorio físico.
              </p>
              <div className="space-y-4 text-sm font-semibold text-slate-300">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-400" />
                  <span>+593 999 888 777</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-400" />
                  <span>contacto@dieteticapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  <span>Av. Francisco de Orellana, Guayaquil, Ecuador</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Déjanos tu mensaje</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado. ¡Nos contactaremos pronto!'); }} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Nombre</span>
                    <input type="text" required placeholder="Carlos" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Correo</span>
                    <input type="email" required placeholder="carlos@gmail.com" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500" />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Mensaje</span>
                  <textarea rows={4} required placeholder="Hola, quisiera agendar una asesoría..." className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 resize-none" />
                </label>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-2xl py-4 text-sm font-bold text-slate-950 transition-all uppercase">
                  Enviar Mensaje
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© 2026 NutriTec. Todos los derechos reservados.</p>
          <p className="mt-2 text-slate-600">Desarrollado para el Proyecto Integrador de Sistemas.</p>
        </div>
      </footer>
    </div>
  )
}
