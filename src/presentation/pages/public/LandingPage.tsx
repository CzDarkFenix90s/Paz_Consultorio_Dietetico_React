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
      } flex flex-col md:flex-row items-center gap-8 border-b border-[#D60001]/20 py-20`}
    >
      {/* Left Monospaced Number */}
      <div className="hidden md:block w-16 text-left text-sm font-extrabold text-[#D60001] tracking-widest">
        {number}
      </div>

      {/* Widescreen Video Card Container */}
      <div className="flex-1 relative aspect-[21/9] w-full overflow-hidden border border-white/10 group bg-slate-950">
        <video 
          src={videoUrl} 
          poster={posterSrc}
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-700 ease-out" 
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-between p-6">
          <div className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">
            {subtitle}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              {title}
            </h3>
            <p className="text-[9px] text-[#D60001] tracking-widest uppercase font-bold">
              [ NutriTec Premium Program ]
            </p>
          </div>
        </div>
      </div>

      {/* Right Action Button */}
      <div className="w-24 text-right">
        <Link 
          to="/register"
          className="inline-block bg-[#D60001] hover:bg-white hover:text-black text-white font-extrabold text-[10px] tracking-widest px-6 py-2.5 transition-colors uppercase"
        >
          VIEW
        </Link>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const heroVideoUrl = getMediaUrl('videos/hero_loop.mp4')

  return (
    <div className="min-h-screen bg-[#000000] text-white font-mono selection:bg-[#D60001] selection:text-white relative overflow-hidden">
      
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Industrial Thin Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#D60001]/25 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-lg font-black tracking-[0.25em] text-white hover:text-[#D60001] transition-colors">
            <span className="text-[#D60001]">●</span> NUTRI_TEC
          </Link>
          
          {/* Menu Links */}
          <nav className="hidden items-center gap-10 md:flex text-xs font-bold tracking-[0.2em] text-slate-400">
            <a href="#beneficios" className="hover:text-white transition-colors relative group">
              [ BENEFICIOS ]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D60001] transition-all group-hover:w-full" />
            </a>
            <a href="#servicios" className="hover:text-white transition-colors relative group">
              [ SERVICIOS ]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D60001] transition-all group-hover:w-full" />
            </a>
            <a href="#contacto" className="hover:text-white transition-colors relative group">
              [ CONTACTO ]
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D60001] transition-all group-hover:w-full" />
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-[0.2em]">
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
              INICIAR_SESIÓN
            </Link>
            <span className="text-slate-700">/</span>
            <Link 
              to="/register" 
              className="border border-[#D60001] hover:bg-[#D60001] text-white px-6 py-3 transition-colors duration-300"
            >
              REGISTRARSE
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded border border-[#D60001]/30 text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-black tracking-[0.25em]">● NUTRI_TEC</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 w-10 flex items-center justify-center rounded border border-[#D60001]/30 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-8 text-xl font-bold tracking-widest text-slate-300 my-auto">
            <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D60001]">[ BENEFICIOS ]</a>
            <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D60001]">[ SERVICIOS ]</a>
            <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D60001]">[ CONTACTO ]</a>
          </nav>

          <div className="flex flex-col gap-4 text-center tracking-[0.2em] text-sm">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="border border-white/10 py-3 text-slate-400 hover:text-white">
              INICIAR SESIÓN
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-[#D60001] py-3 text-white font-bold">
              REGISTRARSE
            </Link>
          </div>
        </div>
      )}

      {/* Cinematic Fullscreen Background Hero */}
      <section className="relative h-screen flex items-center justify-center border-b border-[#D60001]/25">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
          <video 
            src={heroVideoUrl} 
            poster="/assets/patient_banner.png"
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-35" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center space-y-8 select-none">
          <span className="text-[11px] font-bold tracking-[0.6em] text-[#D60001] uppercase block animate-pulse">
            [ NUTRITEC // INDUSTRIAL CLINIC 2.0 ]
          </span>
          
          <h1 className="text-7xl sm:text-[9rem] font-black tracking-tighter text-white uppercase leading-[0.85] text-center max-w-5xl">
            NUTRITECH <br />
            <span className="text-[#D60001]">CINEMA</span>
          </h1>

          <div className="w-48 h-[2px] bg-[#D60001]" />

          <p className="text-[10px] leading-relaxed text-slate-400 max-w-lg tracking-[0.25em] font-semibold uppercase mx-auto">
            [ MONITOREO DIETÉTICO ANTRÓPOMETRICO EN TIEMPO REAL CON ASESORÍA DE ALTA COMPLEJIDAD VÍA STREAMING BACKEND. ]
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <Link
              to="/register"
              className="bg-[#D60001] hover:bg-white hover:text-black text-white px-8 py-4 text-xs font-bold tracking-[0.2em] transition-all uppercase flex items-center gap-2"
            >
              Comenzar <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="#servicios"
              className="border border-white/20 hover:border-white text-white px-8 py-4 text-xs font-bold tracking-[0.2em] transition-all uppercase"
            >
              Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Services Widescreen Portfolio Section */}
      <section id="servicios" className="py-24 border-b border-[#D60001]/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-[11px] font-bold tracking-[0.45em] text-[#D60001] uppercase block">
              [ PROGRAMAS CLÍNICOS / SERVICIOS ]
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl leading-none">
              SERVICIOS DE ALTO ESPECTRO
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed tracking-wider font-semibold">
              [ CADA MÓDULO DIGITAL ESTÁ VINCULADO A LOS VIDEOS E INSTRUCCIONES DE TU NUTRICIONISTA Y CARGA DESDE EL SERVIDOR LOCAL DEL CONSULTORIO. ]
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
      <section id="beneficios" className="py-24 border-b border-[#D60001]/25 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-[11px] font-bold tracking-[0.45em] text-[#D60001] uppercase block">
              [ ESPECIFICACIONES TÉCNICAS / BENEFICIOS ]
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl leading-none">
              METRICAS BAJO CONTROL ABSOLUTO
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
              <div key={item.title} className="border border-white/10 bg-black p-6 hover:border-[#D60001]/40 transition duration-300">
                <div className="text-[10px] font-bold text-[#D60001]">{item.number} // PARAMETRO</div>
                <h3 className="text-base font-bold text-white mt-4 uppercase">{item.title}</h3>
                <p className="text-slate-400 mt-2 text-[11px] leading-relaxed font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action & Contact */}
      <section id="contacto" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl leading-none">
                ¿TIENES DUDAS? <br />
                PONTE EN CONTACTO
              </h2>
              <div className="space-y-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-3">
                  <Phone className="h-4.5 w-4.5 text-[#D60001]" />
                  <span>+593 999 888 777</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4.5 w-4.5 text-[#D60001]" />
                  <span>contacto@dieteticapp.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4.5 w-4.5 text-[#D60001]" />
                  <span>Av. Francisco de Orellana, Guayaquil, Ecuador</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 border border-[#D60001]/30 bg-black p-8 shadow-2xl">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">[ ENTAKE_MESSAGE_BOX ]</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado. ¡Nos contactaremos pronto!'); }} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Nombre</span>
                    <input type="text" required placeholder="Carlos" className="w-full rounded bg-white/5 border border-white/10 px-4 py-3 text-xs text-slate-100 outline-none focus:border-[#D60001]" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Correo</span>
                    <input type="email" required placeholder="carlos@gmail.com" className="w-full rounded bg-white/5 border border-white/10 px-4 py-3 text-xs text-slate-100 outline-none focus:border-[#D60001]" />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mensaje</span>
                  <textarea rows={4} required placeholder="Hola, quisiera agendar una asesoría..." className="w-full rounded bg-white/5 border border-white/10 px-4 py-3 text-xs text-slate-100 outline-none focus:border-[#D60001] resize-none" />
                </label>
                <button type="submit" className="w-full bg-[#D60001] hover:bg-white hover:text-black py-4 text-xs font-bold tracking-[0.2em] text-white transition-all uppercase">
                  Enviar Mensaje
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-[10px] text-slate-500 tracking-wider">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© 2026 NUTRITEC CLINIC. TODOS LOS DERECHOS RESERVADOS.</p>
          <p className="mt-2 text-slate-700">DESARROLLADO PARA EL PROYECTO INTEGRADOR DE SISTEMAS // FASHION-TECH HEALTH 2.0.</p>
        </div>
      </footer>
    </div>
  )
}
