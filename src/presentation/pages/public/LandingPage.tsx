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
function VideoWithFallback({ src, poster, className, style }: { src: string; poster: string; className?: string; style?: React.CSSProperties }) {
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
        style={style}
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
      style={style}
    />
  )
}

function ScrollRevealVideo({ number, title, titleHover, subtitle, subtitleHover, videoName, posterSrc }: any) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      const entryPoint = windowHeight
      const exitPoint = -rect.height
      const totalDistance = entryPoint - exitPoint
      const currentDistance = windowHeight - rect.top
      
      let progress = currentDistance / totalDistance
      progress = Math.max(0, Math.min(1, progress)) // clamp between 0 and 1
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch((err) => {
          console.warn("Video playback was interrupted or blocked:", err)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [isHovered])

  // Calculate dynamic scale and parallax offset based on screen centering
  const distanceFromCenter = Math.abs(scrollProgress - 0.5) // 0 when centered, 0.5 when at edge
  const cardScale = Math.max(0.88, 1 - distanceFromCenter * 0.24) // smoothly scales between 0.88 and 1.00
  const videoParallax = (scrollProgress - 0.5) * -70 // vertical parallax translation

  const videoUrl = `${getMediaUrl(`videos/${videoName}`)}?v=2`

  return (
    <div 
      ref={containerRef}
      className="w-full border-b border-white/5 py-20 flex flex-col items-center overflow-hidden"
    >
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
        
        {/* Left Index (Mono font like op.al specs) */}
        <div className="hidden md:block w-24 text-left font-mono text-xs text-slate-500 tracking-widest">
          {number} //
        </div>

        {/* Widescreen Video Card Container with Smooth Scale-on-Scroll */}
        <div 
          style={{ 
            transform: `scale(${cardScale})`,
            transition: 'transform 0.1s ease-out'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex-1 relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] border border-white/5 bg-slate-950 shadow-2xl origin-center cursor-pointer group"
        >
          {/* Static Image (Poster) */}
          <img 
            src={posterSrc} 
            alt={title} 
            className={`w-full h-full absolute inset-0 object-cover scale-110 transition-opacity duration-1000 ease-out ${
              isHovered ? 'opacity-20' : 'opacity-60'
            }`}
            style={{
              transform: `scale(1.15) translateY(${videoParallax}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />

          {/* Video element - plays and fades in on hover */}
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            className={`w-full h-full absolute inset-0 object-cover scale-110 transition-opacity duration-1000 ease-out ${
              isHovered ? 'opacity-90' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              transform: `scale(1.15) translateY(${videoParallax}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          
          {/* Overlay Gradients and Dynamic Text (Opal-style Layout) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-8 pointer-events-none">
            {/* Dynamic subtitle container with cross-fade */}
            <div className="relative w-full h-4 font-mono text-[9px] tracking-[0.3em] uppercase">
              {/* Default Subtitle */}
              <div className={`absolute top-0 left-0 text-emerald-400/80 transition-all duration-700 ease-in-out ${
                isHovered ? 'opacity-0 -translate-y-1 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}>
                {subtitle}
              </div>

              {/* Hover Subtitle */}
              <div className={`absolute top-0 left-0 text-teal-300 font-bold transition-all duration-700 ease-in-out ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
              }`}>
                {subtitleHover}
              </div>
            </div>
            
            {/* Dynamic title container with cross-fade */}
            <div className="space-y-1.5">
              <div className="relative w-full h-12 md:h-14">
                {/* Default Title */}
                <h3 className={`absolute top-0 left-0 text-2xl md:text-5xl font-serif tracking-tight text-white transition-all duration-700 ease-in-out ${
                  isHovered ? 'opacity-0 -translate-y-2 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'
                }`}>
                  {title}
                </h3>

                {/* Hover Title */}
                <h3 className={`absolute top-0 left-0 w-full text-2xl md:text-5xl font-serif italic tracking-tight text-emerald-400 transition-all duration-700 ease-in-out ${
                  isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                }`}>
                  {titleHover}
                </h3>
              </div>
              <p className="font-mono text-[9px] text-slate-500 tracking-[0.2em] uppercase pt-1">
                NutriTec specifications
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Button (Opal minimalist style) */}
        <div className="w-24 text-right">
          <Link 
            to="/register"
            className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border-b pb-1 ${
              isHovered 
                ? 'border-emerald-400 text-emerald-400 translate-x-1' 
                : 'border-white/20 text-slate-400'
            }`}
          >
            Ver <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const heroVideoUrl = `${getMediaUrl('videos/1.mp4')}?v=2`

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.02] blur-[150px] pointer-events-none" />

      {/* Premium Navbar Header (Opal thin grid style) */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white font-serif">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black text-sm">
              N
            </span>
            Nutri<span className="text-emerald-400 font-sans font-black">Tec</span>
          </Link>
          
          {/* Menu Links (Monospaced uppercase) */}
          <nav className="hidden items-center gap-8 md:flex font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase">
            <a href="#beneficios" className="hover:text-white transition">Beneficios</a>
            <a href="#servicios" className="hover:text-white transition">Servicios</a>
            <a href="#contacto" className="hover:text-white transition">Contacto</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="font-mono text-[10px] tracking-[0.2em] text-slate-400 hover:text-white uppercase transition">
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold font-mono tracking-widest text-slate-950 hover:bg-emerald-400 transition uppercase shadow-[0_0_25px_rgba(16,185,129,0.15)]"
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
            <span className="text-xl font-serif text-white">Nutri<span className="text-emerald-400 font-sans font-black">Tec</span></span>
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

      {/* Cinematic Fullscreen Background Hero (Editorial Layout) */}
      <section className="relative h-[90vh] flex items-center border-b border-white/5">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <VideoWithFallback 
            src={heroVideoUrl}
            poster="/assets/patient_banner.png"
            className="w-full h-full opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="max-w-4xl space-y-10">
            <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-emerald-400 rounded-full">
              Tu salud inteligente empieza hoy
            </span>
            
            <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-serif tracking-tight text-white leading-[0.9] max-w-3xl">
              Alcanza tu mejor versión con <br />
              <span className="italic font-normal bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                planes nutricionales
              </span> a tu medida.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl font-sans">
              En nuestro Consultorio Dietético fusionamos la ciencia de la nutrición con tecnología intuitiva para crear planes alimenticios personalizados que realmente se adapten a tu estilo de vida.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-full text-xs font-mono tracking-widest font-bold transition shadow-lg shadow-emerald-500/10 uppercase flex items-center gap-2"
              >
                Comienza Gratis <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#servicios"
                className="border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-full text-xs font-mono tracking-widest font-bold transition uppercase"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Widescreen Portfolio Section (Opal Camera layout) */}
      <section id="servicios" className="py-24 border-b border-white/5 bg-slate-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-emerald-400">
              Nuestros Servicios
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-white leading-none">
              Soluciones Clínicas y Deportivas
            </h2>
            <p className="text-base text-slate-400 leading-relaxed font-sans max-w-xl">
              Explora las herramientas diseñadas para guiar tu cambio de hábitos de forma visual, profesional e interactiva.
            </p>
          </div>

          {/* Scale-on-scroll and parallax video items */}
          <div className="space-y-0">
            <ScrollRevealVideo 
              number="01"
              title="DIETAS"
              titleHover="PLANES DE DIETA"
              subtitle="Cálculo analítico de macronutrientes"
              subtitleHover="[ PROTEÍNAS · CARBOHIDRATOS · GRASAS ]"
              videoName="2.mp4"
              posterSrc="/assets/service_diet.png"
            />
            <ScrollRevealVideo 
              number="02"
              title="EVALUACIÓN ANTROPOMÉTRICA"
              titleHover="PROGRESO CORPORAL"
              subtitle="Control diario y composición corporal"
              subtitleHover="[ PESO · COMPOSICIÓN · AGUA ]"
              videoName="3.mp4"
              posterSrc="/assets/service_gym.png"
            />
            <ScrollRevealVideo 
              number="03"
              title="RECETAS"
              titleHover="RECETARIO INTELIGENTE"
              subtitle="Instrucciones en video y porciones exactas"
              subtitleHover="[ PASOS EN VIDEO · PORCIONES EXACTAS ]"
              videoName="4.mp4"
              posterSrc="/assets/service_recipe.png"
            />
          </div>

        </div>
      </section>

      {/* Benefits Specifications Section (Opal technical layout grid) */}
      <section id="beneficios" className="py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-20">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-emerald-400">
              Por qué elegirnos
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-white leading-none">
              Tu bienestar, estructurado y bajo control
            </h2>
          </div>

          {/* Grid layout separated by ultra-thin technical border lines */}
          <div className="grid border-t border-l border-white/5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { number: '01', title: 'NUTRICIÓN CIENTÍFICA', desc: 'Planes validados por profesionales basados en evaluaciones clínicas y antropométricas.' },
              { number: '02', title: 'PLATAFORMA INTERACTIVA', desc: 'Acceso privado para registrar tu consumo de agua, comidas y síntomas diarios.' },
              { number: '03', title: 'PANEL DE ESPECIALISTAS', desc: 'Asignación de nutricionistas dedicados que controlan y editan tus rutinas y dietas.' },
              { number: '04', title: 'CONTROL DE ALIMENTOS', desc: 'Catálogos y categorías estructuradas para evitar la desorganización de ingredientes.' },
              { number: '05', title: 'SEGURIDAD JWT', desc: 'Autenticación encriptada para mantener tu historial clínico e información de salud 100% privada.' },
              { number: '06', title: 'EVIDENCIA VISUAL', desc: 'Sube fotos de tu progreso directamente a nuestro servidor de manera totalmente privada.' },
            ].map((item) => (
              <div key={item.title} className="border-r border-b border-white/5 bg-slate-950/20 p-8 hover:bg-white/[0.01] transition duration-300 group">
                <div className="font-mono text-[9px] text-slate-500 group-hover:text-emerald-400 transition-colors tracking-widest">{item.number} // ESPECIFICACIÓN</div>
                <h3 className="text-base font-bold text-white mt-6 uppercase font-mono tracking-wider">{item.title}</h3>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action & Contact */}
      <section id="contacto" className="py-24 bg-slate-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-6 space-y-8">
              <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-white leading-none">
                ¿Tienes dudas? <br />
                Ponte en contacto.
              </h2>
              <p className="text-base text-slate-400 leading-relaxed max-w-lg">
                Estamos aquí para acompañarte en tu transformación física y alimentaria. Escríbenos o visítanos en nuestro consultorio físico.
              </p>
              <div className="space-y-4 font-mono text-[11px] tracking-wider text-slate-300">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>+593 999 888 777</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <span>contacto@dieteticapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>Av. Francisco de Orellana, Guayaquil, Ecuador</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-[2rem] border border-white/5 bg-slate-950 p-8 shadow-2xl">
              <h3 className="text-lg font-bold font-mono text-white mb-6 uppercase tracking-widest">Enviar un mensaje</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado. ¡Nos contactaremos pronto!'); }} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-slate-400">Nombre</span>
                    <input type="text" required placeholder="Carlos" className="w-full rounded-2xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500" />
                  </label>
                  <label className="block space-y-2">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-slate-400">Correo</span>
                    <input type="email" required placeholder="carlos@gmail.com" className="w-full rounded-2xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500" />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className="font-mono text-[9px] tracking-widest uppercase text-slate-400">Mensaje</span>
                  <textarea rows={4} required placeholder="Hola, quisiera agendar una asesoría..." className="w-full rounded-2xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 resize-none" />
                </label>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-2xl py-4 font-mono text-xs font-bold tracking-widest text-slate-950 transition-all uppercase">
                  Enviar Mensaje
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 text-center text-xs text-slate-500 font-mono tracking-wider">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© 2026 NutriTec. Todos los derechos reservados.</p>
          <p className="mt-2 text-slate-600 uppercase text-[9px] tracking-[0.2em]">Desarrollado para el Proyecto Integrador de Sistemas.</p>
        </div>
      </footer>
    </div>
  )
}
