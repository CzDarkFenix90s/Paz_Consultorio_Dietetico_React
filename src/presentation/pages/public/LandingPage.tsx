import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  MapPin,
  ArrowUpRight,
  X,
  Maximize2,
  Tv,
  Activity,
  ChefHat,
  Droplets,
  MessageSquare,
  ShieldCheck
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Helper to resolve media files from Django backend
const getMediaUrl = (path: string) => {
  if (import.meta.env.PROD) {
    return `/media/${path}`
  }
  return `http://localhost:8000/media/${path}`
}

// Custom Video Player that falls back gracefully to a poster image if not found on the backend
function VideoWithFallback({ src, poster, className, style }: { src: string; poster: string; className?: string; style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      className={`${className} object-cover`}
      style={style}
    />
  )
}

function ScrollRevealVideo({ number, title, titleHover, subtitle, videoName, posterSrc, onOpenModal }: any) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useGSAP(() => {
    if (!containerRef.current || !cardRef.current) return

    gsap.fromTo(
      cardRef.current,
      { scale: 0.88, opacity: 0.7 },
      {
        scale: 1,
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 0.6,
        },
      }
    )

    if (posterRef.current) {
      gsap.fromTo(
        posterRef.current,
        { y: -30 },
        {
          y: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }
  }, { scope: containerRef })

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isHovered])

  const videoUrl = `${getMediaUrl(`videos/${videoName}`)}?v=2`

  return (
    <div 
      ref={containerRef}
      className="w-full border-b border-white/10 py-16 flex flex-col items-center overflow-hidden"
    >
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
        
        {/* Left Index (Mono font like op.al / kvs specs) */}
        <div className="hidden md:block w-28 text-left font-mono text-xs text-orange-500 tracking-widest">
          &#123;{number}&#125; //
        </div>

        {/* Widescreen CRT Video Card */}
        <div 
          ref={cardRef}
          onClick={onOpenModal}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex-1 relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl origin-center cursor-pointer group hover:border-orange-500/50 transition-colors duration-500"
        >
          {/* Static Image (Poster) */}
          <img 
            ref={posterRef}
            src={posterSrc} 
            alt={title} 
            className={`w-full h-full absolute inset-0 object-cover scale-110 transition-opacity duration-1000 ease-out ${
              isHovered ? 'opacity-20' : 'opacity-60'
            }`}
          />

          {/* Video element */}
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            className={`w-full h-full absolute inset-0 object-cover scale-110 transition-opacity duration-1000 ease-out ${
              isHovered ? 'opacity-90' : 'opacity-0 pointer-events-none'
            }`}
          />
          
          {/* Overlay Gradients and Dynamic Text (kvs.services style) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex flex-col justify-between p-8 pointer-events-none">
            
            {/* Top Subtitle with orange badge */}
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.25em] uppercase">
              <span className="bg-orange-500 text-slate-950 px-2 py-0.5 font-bold rounded">
                TAP TO OPEN
              </span>
              <span className="text-emerald-400 font-bold">
                &#123;{subtitle}&#125;
              </span>
            </div>
            
            {/* Dynamic title container */}
            <div className="space-y-2">
              <div className="relative w-full h-12 md:h-14">
                {/* Default Title */}
                <h3 className={`absolute top-0 left-0 text-2xl md:text-5xl font-mono uppercase tracking-tight text-white transition-all duration-700 ease-in-out ${
                  isHovered ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
                }`}>
                  {title}
                </h3>

                {/* Hover Title */}
                <h3 className={`absolute top-0 left-0 w-full text-2xl md:text-5xl font-mono font-bold tracking-tight text-emerald-400 transition-all duration-700 ease-in-out ${
                  isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                }`}>
                  {titleHover}
                </h3>
              </div>
              <p className="font-mono text-[9px] text-slate-400 tracking-[0.2em] uppercase">
                &#123;NUTRITEC SPECIFICATION // MODULE {number}&#125;
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="w-28 text-right">
          <button 
            onClick={onOpenModal}
            className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border-b pb-1 ${
              isHovered 
                ? 'border-orange-500 text-orange-400 translate-x-1' 
                : 'border-white/20 text-slate-400'
            }`}
          >
            INFO <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  )
}

export default function LandingPage() {
  const [scanlinesActive, setScanlinesActive] = useState(true)
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null)

  const heroContainerRef = useRef<HTMLDivElement>(null)
  const crtScreenRef = useRef<HTMLDivElement>(null)
  const heroBadgeRef = useRef<HTMLSpanElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroTextRef = useRef<HTMLParagraphElement>(null)
  const heroCtaRef = useRef<HTMLDivElement>(null)
  const specGridRef = useRef<HTMLDivElement>(null)

  const heroVideoUrl = `${getMediaUrl('videos/1.mp4')}?v=2`

  // Interactive CRT Floating Monitor items (Screenshot 2 of kvs.services)
  const monitorGridItems = [
    {
      id: '01',
      tag: 'DIETAS',
      title: 'PAUTA NUTRICIONAL DE MACROS',
      desc: 'Formulación matemática de macronutrientes (Proteínas, Carbohidratos y Grasas) según requerimiento energético basal.',
      icon: Activity,
      video: '2.mp4',
      poster: '/assets/service_diet.png'
    },
    {
      id: '02',
      tag: 'COMPOSICIÓN',
      title: 'CONTROL ANTROPOMÉTRICO',
      desc: 'Seguimiento visual e histórico de masa magra, porcentaje de grasa y retención de líquidos.',
      icon: Tv,
      video: '3.mp4',
      poster: '/assets/service_gym.png'
    },
    {
      id: '03',
      tag: 'RECETAS',
      title: 'RECETARIO EN VIDEO HD',
      desc: 'Instrucciones paso a paso con dosificación exacta de ingredientes y técnicas de cocción.',
      icon: ChefHat,
      video: '4.mp4',
      poster: '/assets/service_recipe.png'
    },
    {
      id: '04',
      tag: 'HIDRATACIÓN',
      title: 'BALANCE HÍDRICO DIARIO',
      desc: 'Control intuitivo de consumo de agua con metas calculadas según peso y nivel de actividad física.',
      icon: Droplets,
      video: '2.mp4',
      poster: '/assets/service_diet.png'
    },
    {
      id: '05',
      tag: 'CHAT',
      title: 'COMUNICACIÓN CON NUTRICIONISTA',
      desc: 'Envío de mensajes privados en tiempo real para resolver dudas alimentarias directamente.',
      icon: MessageSquare,
      video: '3.mp4',
      poster: '/assets/service_gym.png'
    },
    {
      id: '06',
      tag: 'SEGURIDAD',
      title: 'ENCRIPTACIÓN JWT Y PRIVACIDAD',
      desc: 'Protección de expediente clínico bajo estándares internacionales de encriptación.',
      icon: ShieldCheck,
      video: '4.mp4',
      poster: '/assets/service_recipe.png'
    }
  ]

  // GSAP CRT Power-On Intro Timeline Sequence
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // CRT Power-On beam flash expansion
    if (crtScreenRef.current) {
      tl.fromTo(
        crtScreenRef.current,
        { scaleY: 0.005, opacity: 0, filter: 'brightness(3)' },
        { scaleY: 1, opacity: 1, filter: 'brightness(1)', duration: 0.8, ease: 'power4.inOut' }
      )
    }

    if (heroBadgeRef.current) {
      tl.fromTo(heroBadgeRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
    }

    if (heroTitleRef.current) {
      tl.fromTo(heroTitleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
    }

    if (heroTextRef.current) {
      tl.fromTo(heroTextRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    }

    if (heroCtaRef.current) {
      tl.fromTo(heroCtaRef.current.children, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
    }

    if (specGridRef.current) {
      gsap.fromTo(
        specGridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: specGridRef.current,
            start: 'top 80%',
          },
        }
      )
    }
  }, { scope: heroContainerRef })

  const tickerItems = [
    '{DIETAS CLÍNICAS}',
    '{EVALUACIÓN ANTROPOMÉTRICA}',
    '{RECETAS EN VIDEO}',
    '{CONTROL DE MACROS}',
    '{EXPEDIENTE DIGITAL}',
    '{REGISTRO DE AGUA}',
    '{SEGURIDAD JWT}',
    '{SEGUIMIENTO DE AVANCE}'
  ]

  return (
    <div ref={heroContainerRef} className="min-h-screen bg-black text-slate-100 font-mono selection:bg-orange-500 selection:text-black p-2 sm:p-4 md:p-6 relative">
      
      {/* Outer CRT Bezel Container (Curved Monitor Frame like kvs.services) */}
      <div 
        ref={crtScreenRef}
        className="relative min-h-[96vh] rounded-[2rem] sm:rounded-[3rem] border border-white/10 bg-slate-950 crt-screen-bevel overflow-hidden flex flex-col justify-between"
      >
        {/* Optional CRT Scanlines Texture Overlay */}
        {scanlinesActive && (
          <div className="pointer-events-none absolute inset-0 z-40 crt-scanlines opacity-40 mix-blend-overlay" />
        )}

        {/* Top Technical Bracket Navigation Header (Exact kvs.services layout) */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase">
            
            {/* Logo with technical brackets */}
            <Link to="/" className="flex items-center gap-3 text-white font-bold text-sm tracking-widest hover:text-emerald-400 transition">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500 text-slate-950 font-black text-xs">
                N
              </span>
              <span>&#123;NUTRITEC / CLINIC&#125;</span>
            </Link>

            {/* Location tag */}
            <div className="hidden lg:flex items-center gap-2 text-slate-500">
              <span>&#123;GUAYAQUIL / ECUADOR&#125;</span>
            </div>

            {/* Scanlines Toggle & Status */}
            <div className="hidden sm:flex items-center gap-6">
              <button 
                onClick={() => setScanlinesActive(!scanlinesActive)}
                className="flex items-center gap-2 text-[9px] hover:text-white transition"
              >
                <span>&#123;CRT SCANLINES&#125;</span>
                <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${scanlinesActive ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {scanlinesActive ? 'ON' : 'OFF'}
                </span>
              </button>

              <div className="flex items-center gap-2 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>&#123;STATUS: ONLINE&#125;</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-white transition">
                &#123;LOGIN&#125;
              </Link>
              <Link 
                to="/register" 
                className="bg-orange-500 text-slate-950 px-4 py-1.5 font-bold rounded hover:bg-orange-400 transition tracking-widest"
              >
                CONTACT
              </Link>
            </div>

          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex flex-col justify-center border-b border-white/10">
          
          {/* Background Video */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950 opacity-30">
            <VideoWithFallback 
              src={heroVideoUrl}
              poster="/assets/patient_banner.png"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="max-w-4xl space-y-8">
              
              <span 
                ref={heroBadgeRef}
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase bg-orange-500 text-slate-950 font-bold px-3 py-1 rounded"
              >
                [001] NUTRITION AND CLINICAL EXCELLENCE
              </span>

              <h1 
                ref={heroTitleRef}
                className="text-4xl sm:text-6xl lg:text-7xl font-mono uppercase tracking-tight text-white leading-none"
              >
                Alcanza tu mejor versión con <br />
                <span className="text-emerald-400 font-bold underline decoration-orange-500 decoration-4 underline-offset-8">
                  planes nutricionales
                </span> a tu medida.
              </h1>

              <p 
                ref={heroTextRef}
                className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed font-sans"
              >
                En nuestro Consultorio Dietético fusionamos la ciencia de la nutrición con tecnología intuitiva para crear planes alimenticios personalizados que realmente se adapten a tu estilo de vida.
              </p>

              <div ref={heroCtaRef} className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded text-xs font-mono tracking-widest font-bold transition uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Comienza Gratis <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="#monitores"
                  className="border border-white/20 hover:border-orange-500 text-slate-300 hover:text-orange-400 px-8 py-4 rounded text-xs font-mono tracking-widest font-bold transition uppercase"
                >
                  Explorar Monitores
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Continuous Horizontal Ticker / Marquee Band (kvs.services signature element) */}
        <div className="w-full bg-slate-900/90 border-y border-white/10 py-3 overflow-hidden">
          <div className="animate-marquee flex gap-12 font-mono text-xs text-slate-300 tracking-widest uppercase">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={idx} className="flex items-center gap-4 whitespace-nowrap">
                <span className="text-orange-500 font-bold">[00{idx % 5 + 1}]</span>
                <span className="hover:text-emerald-400 transition cursor-default">{item}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Floating Monitor Grid (Exact kvs.services Screenshot 2 layout) */}
        <section id="monitores" className="py-24 border-b border-white/10 bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-orange-500 text-[10px] tracking-[0.3em] uppercase font-bold">
                  &#123;SYSTEM MODULES // GRID GALLERY&#125;
                </span>
                <h2 className="text-3xl sm:text-5xl font-mono uppercase tracking-tight text-white mt-2">
                  Monitores del Consultorio
                </h2>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Haz clic en cualquiera de las pantallas para abrir la vista previa interactiva en modo alta definición.
              </p>
            </div>

            {/* Grid of 6 interactive screens */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {monitorGridItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveModalItem(item)}
                    className="group relative rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:border-orange-500/80 transition duration-500 cursor-pointer overflow-hidden flex flex-col justify-between h-72 shadow-xl hover:shadow-orange-500/10"
                  >
                    {/* Background image preview with blur scanlines */}
                    <img 
                      src={item.poster} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition duration-700 pointer-events-none"
                    />

                    {/* Top Bar */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                      <span className="bg-orange-500 text-slate-950 px-2 py-0.5 font-bold rounded">
                        &#123;{item.id}&#125; {item.tag}
                      </span>
                      <Maximize2 className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition" />
                    </div>

                    {/* Center Icon */}
                    <div className="relative z-10 my-auto flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition duration-500">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold font-mono text-white tracking-wider uppercase group-hover:text-emerald-300 transition">
                        {item.title}
                      </h3>
                    </div>

                    {/* Bottom Prompt */}
                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400 font-mono">
                      <span>TAP TO OPEN</span>
                      <span className="text-orange-400 font-bold group-hover:translate-x-1 transition">INFO &rarr;</span>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </section>

        {/* Widescreen Video Showcase Section */}
        <section id="servicios" className="py-20 bg-slate-900/20 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-0">
              <ScrollRevealVideo 
                number="01"
                title="DIETAS Y MACROS"
                titleHover="PLANES DE DIETA"
                subtitle="Cálculo analítico de macronutrientes"
                subtitleHover="[ PROTEÍNAS · CARBOHIDRATOS · GRASAS ]"
                videoName="2.mp4"
                posterSrc="/assets/service_diet.png"
                onOpenModal={() => setActiveModalItem(monitorGridItems[0])}
              />
              <ScrollRevealVideo 
                number="02"
                title="EVALUACIÓN ANTROPOMÉTRICA"
                titleHover="PROGRESO CORPORAL"
                subtitle="Control diario y composición corporal"
                subtitleHover="[ PESO · COMPOSICIÓN · AGUA ]"
                videoName="3.mp4"
                posterSrc="/assets/service_gym.png"
                onOpenModal={() => setActiveModalItem(monitorGridItems[1])}
              />
              <ScrollRevealVideo 
                number="03"
                title="RECETAS INTELIGENTES"
                titleHover="RECETARIO EN VIDEO"
                subtitle="Instrucciones en video y porciones exactas"
                subtitleHover="[ PASOS EN VIDEO · PORCIONES EXACTAS ]"
                videoName="4.mp4"
                posterSrc="/assets/service_recipe.png"
                onOpenModal={() => setActiveModalItem(monitorGridItems[2])}
              />
            </div>
          </div>
        </section>

        {/* Specifications Grid */}
        <section id="beneficios" className="py-24 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl space-y-3 mb-16">
              <span className="text-emerald-400 text-[10px] tracking-[0.3em] uppercase font-bold">
                &#123;SYSTEM SPECIFICATIONS&#125;
              </span>
              <h2 className="text-3xl sm:text-5xl font-mono uppercase tracking-tight text-white">
                Por qué elegir NutriTec
              </h2>
            </div>

            <div ref={specGridRef} className="grid border-t border-l border-white/10 md:grid-cols-2 lg:grid-cols-3">
              {[
                { number: '01', title: 'NUTRICIÓN CIENTÍFICA', desc: 'Planes validados por profesionales basados en evaluaciones clínicas y antropométricas.' },
                { number: '02', title: 'PLATAFORMA INTERACTIVA', desc: 'Acceso privado para registrar tu consumo de agua, comidas y síntomas diarios.' },
                { number: '03', title: 'PANEL DE ESPECIALISTAS', desc: 'Asignación de nutricionistas dedicados que controlan y editan tus rutinas y dietas.' },
                { number: '04', title: 'CONTROL DE ALIMENTOS', desc: 'Catálogos y categorías estructuradas para evitar la desorganización de ingredientes.' },
                { number: '05', title: 'SEGURIDAD JWT', desc: 'Autenticación encriptada para mantener tu historial clínico e información de salud 100% privada.' },
                { number: '06', title: 'EVIDENCIA VISUAL', desc: 'Sube fotos de tu progreso directamente a nuestro servidor de manera totalmente privada.' },
              ].map((item) => (
                <div key={item.title} className="border-r border-b border-white/10 bg-slate-950/40 p-8 hover:bg-slate-900/40 transition duration-300 group">
                  <div className="text-[9px] text-orange-500 tracking-widest">&#123;{item.number}&#125; // SPECIFICATION</div>
                  <h3 className="text-base font-bold text-white mt-4 uppercase tracking-wider">{item.title}</h3>
                  <p className="text-slate-400 mt-2 text-xs leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Contact Form & Footer */}
        <section id="contacto" className="py-20 bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <span className="text-orange-500 text-[10px] tracking-[0.3em] font-bold uppercase">&#123;CONTACT / SUPPORT&#125;</span>
                <h2 className="text-3xl sm:text-5xl font-mono uppercase tracking-tight text-white leading-none">
                  ¿Tienes dudas? <br />
                  Ponte en contacto.
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-lg">
                  Estamos aquí para acompañarte en tu transformación física y alimentaria. Escríbenos o visítanos en nuestro consultorio físico.
                </p>
                <div className="space-y-3 text-[11px] tracking-wider text-slate-300">
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

              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl">
                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">&#123;SEND MESSAGE&#125;</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado. ¡Nos contactaremos pronto!'); }} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-[9px] tracking-widest uppercase text-slate-400">Nombre</span>
                      <input type="text" required placeholder="Carlos" className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 text-xs text-slate-100 outline-none focus:border-orange-500" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[9px] tracking-widest uppercase text-slate-400">Correo</span>
                      <input type="email" required placeholder="carlos@gmail.com" className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 text-xs text-slate-100 outline-none focus:border-orange-500" />
                    </label>
                  </div>
                  <label className="block space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-slate-400">Mensaje</span>
                    <textarea rows={3} required placeholder="Hola, quisiera agendar una asesoría..." className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 text-xs text-slate-100 outline-none focus:border-orange-500 resize-none" />
                  </label>
                  <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 rounded-xl py-3 text-xs font-bold tracking-widest transition-all uppercase">
                    Enviar Mensaje
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500 tracking-wider">
          <p>© 2026 NutriTec. Todos los derechos reservados.</p>
          <p className="mt-1 text-slate-600 uppercase text-[9px] tracking-[0.2em]">Desarrollado para el Proyecto Integrador de Sistemas.</p>
        </footer>

      </div>

      {/* Interactive Modal Zoom View for Floating Monitor ("TAP TO OPEN") */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-4xl rounded-3xl border border-orange-500/50 bg-slate-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(255,85,0,0.2)] overflow-hidden flex flex-col gap-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="bg-orange-500 text-slate-950 font-bold px-2 py-0.5 text-xs rounded">
                  &#123;MODULE {activeModalItem.id}&#125;
                </span>
                <h3 className="text-lg font-bold text-white tracking-wider">
                  {activeModalItem.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalItem(null)}
                className="h-9 w-9 rounded-full border border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video / Content Display */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <video 
                src={`${getMediaUrl(`videos/${activeModalItem.video}`)}?v=2`}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex items-end">
                <p className="text-sm text-slate-200 font-sans max-w-xl">
                  {activeModalItem.desc}
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[10px] text-slate-500">NUTRITEC CLINICAL SYSTEM // CRT MONITOR VIEW</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveModalItem(null)}
                  className="bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold px-6 py-2 rounded uppercase tracking-widest transition"
                >
                  BACK HOME
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
