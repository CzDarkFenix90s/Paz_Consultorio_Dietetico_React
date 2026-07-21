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
  ShieldCheck,
  Volume2,
  VolumeX,
  Terminal
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

// 0-Dependency Web Audio API 8-Bit Retro Sound Synthesizer
function playRetroSound(type: 'click' | 'hover' | 'explode' | 'boot', soundEnabled: boolean) {
  if (!soundEnabled) return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime

    if (type === 'click') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.start(now)
      osc.stop(now + 0.08)
    } else if (type === 'hover') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(580, now)
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.04)
      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      osc.start(now)
      osc.stop(now + 0.04)
    } else if (type === 'boot') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.linearRampToValueAtTime(550, now + 0.25)
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (type === 'explode') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(260, now)
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc.start(now)
      osc.stop(now + 0.5)
    }
  } catch {
    // Audio Context fail silent
  }
}

// Particle Shatter Canvas Splash Overlay ("CLICK TO ENTER / CLICK TO BREAK")
// Symmetrical Cyber-Sigilism Emblem for NUTRITEC (Exact Target Screenshot)
function CyberSigilismNutritecLogo({ className = "w-full max-w-2xl h-auto" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 1000 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]"
      >
        <defs>
          {/* Cyan Phosphor Dot Matrix Mesh Pattern matching screenshot */}
          <pattern id="cyan-dot-matrix" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="#2d373c" />
            <circle cx="2.5" cy="2.5" r="1.2" fill="#7dd3fc" opacity="0.8" />
          </pattern>
          {/* Cyan Glow Gradient */}
          <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Cyber-Sigilism Symmetrical Top Arching Halo Wings (Cyan Glow) */}
        <path
          d="M 500,40 C 380,10 240,30 140,90 C 80,130 40,180 30,240 C 35,260 55,250 65,230 C 80,190 120,150 180,115 C 250,75 350,55 450,55 C 380,85 310,135 260,195 C 230,230 210,270 215,300 C 220,310 235,300 240,280 C 250,240 285,195 335,155 C 390,115 460,85 500,75 C 540,85 610,115 665,155 C 715,195 750,240 760,280 C 765,300 780,310 785,300 C 790,270 770,230 740,195 C 690,135 620,85 550,55 C 650,55 750,75 820,115 C 880,150 920,190 935,230 C 945,250 965,260 970,240 C 960,180 920,130 860,90 C 760,30 620,10 500,40 Z"
          fill="url(#cyan-dot-matrix)"
          stroke="#38bdf8"
          strokeWidth="2.5"
        />

        {/* Lower Symmetrical Organic Tribal Roots & Thorn Branches */}
        <g stroke="url(#cyan-glow)" strokeWidth="3" fill="none">
          <path d="M 500,280 C 440,320 370,350 300,370 C 260,380 220,385 190,375 C 230,360 280,340 330,310 C 390,275 440,230 470,180 Z" fill="url(#cyan-dot-matrix)" />
          <path d="M 500,280 C 560,320 630,350 700,370 C 740,380 780,385 810,375 C 770,360 720,340 670,310 C 610,275 560,230 530,180 Z" fill="url(#cyan-dot-matrix)" />
          <path d="M 500,260 L 500,380 M 460,290 L 410,360 M 540,290 L 590,360 M 480,310 L 450,375 M 520,310 L 550,375" strokeWidth="2.5" />
        </g>

        {/* Integrated Center NUTRITEC Text (Clean White/Cyan Monospace Font) */}
        <text
          x="500"
          y="215"
          textAnchor="middle"
          fill="#f8fafc"
          stroke="#1e293b"
          strokeWidth="6"
          className="font-black text-6xl sm:text-7xl md:text-8xl tracking-[0.22em] uppercase font-mono"
          style={{ letterSpacing: '0.22em', filter: 'drop-shadow(0 0 12px #38bdf8)' }}
        >
          NUTRITEC
        </text>

        {/* Ink Blotches / Ground Reflections under logo */}
        <g fill="#1e293b" opacity="0.8">
          <ellipse cx="500" cy="330" rx="140" ry="10" />
          <path d="M 320,325 Q 380,340 440,328 Q 520,342 600,326 Q 660,340 720,325 Q 640,355 500,350 Q 380,355 320,325 Z" />
          <circle cx="280" cy="335" r="4" />
          <circle cx="340" cy="345" r="6" />
          <circle cx="410" cy="350" r="7" />
          <circle cx="580" cy="352" r="6" />
          <circle cx="660" cy="342" r="5" />
        </g>
      </svg>
    </div>
  )
}

// Canvas Shatter Splash Component (Exact target screenshot matching)
function CanvasShatterSplash({ onFinish, soundEnabled }: { onFinish: () => void; soundEnabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shattering, setShattering] = useState(false)

  const handleShatter = (e: React.MouseEvent) => {
    if (shattering) return
    setShattering(true)
    playRetroSound('explode', soundEnabled)

    const canvas = canvasRef.current
    if (!canvas) {
      onFinish()
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      onFinish()
      return
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const clickX = e.clientX || canvas.width / 2
    const clickY = e.clientY || canvas.height / 2

    // Explosive particles
    const colors = ['#ff5500', '#38bdf8', '#7dd3fc', '#ffffff', '#eab308']
    const particles = Array.from({ length: 350 }).map(() => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 18 + 4
      return {
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.01
      }
    })

    let animId: number
    const render = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      let aliveCount = 0
      particles.forEach((p) => {
        if (p.alpha > 0) {
          aliveCount++
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.15
          p.alpha -= p.decay

          ctx.fillStyle = p.color
          ctx.globalAlpha = Math.max(0, p.alpha)
          ctx.shadowBlur = 10
          ctx.shadowColor = p.color
          ctx.fillRect(p.x, p.y, p.size, p.size)
        }
      })

      if (aliveCount > 0) {
        animId = requestAnimationFrame(render)
      } else {
        cancelAnimationFrame(animId)
        onFinish()
      }
    }

    render()

    setTimeout(() => {
      onFinish()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-black p-1 sm:p-4 flex items-center justify-center font-mono selection:bg-orange-500 selection:text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50" />

      {/* Light Off-White / Silver Retro Television Chassis Frame (Exact Target Screenshot 2) */}
      <div className="relative w-full max-w-7xl h-[90vh] sm:h-[94vh] p-3 sm:p-6 md:p-8 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#e1e6ea] border-4 sm:border-8 border-[#d4dbdf] shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex items-center justify-center crt-scanlines">
        
        {/* Top-Left Yellow AWS SITE OF THE DAY Ribbon Badge */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#facc15] text-slate-950 px-3 py-1 font-mono text-[9px] sm:text-[10px] font-black tracking-tight shadow-md uppercase transform -rotate-12 border border-amber-500 z-40 pointer-events-none">
          AWS SITE OF THE DAY
        </div>

        {/* Right Red Ribbon Badge */}
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 bg-red-600 text-white px-1.5 py-4 font-mono text-[8px] font-bold tracking-widest uppercase [writing-mode:vertical-rl] rounded-l z-40 shadow-md pointer-events-none">
          Site of the Day
        </div>

        {/* Dark Slate Grey CRT Terminal Glass Screen */}
        <div 
          onClick={handleShatter}
          className="relative w-full h-full rounded-[1.8rem] sm:rounded-[2.8rem] bg-[#384349] text-slate-100 border-4 sm:border-8 border-[#242d32] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between p-4 sm:p-8 md:p-10 cursor-pointer"
        >
          {/* Fine TV Mesh Grid Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply z-20"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '4px 4px'
            }}
          />

          {/* Top Terminal Info Bar */}
          <div className="relative z-20 flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-200 tracking-[0.2em] uppercase border-b border-slate-400/20 pb-3">
            <span className="flex items-center gap-2 text-slate-100">
              <Terminal className="h-4 w-4 text-slate-300" /> &gt;_ [NUTRITEC BOOTLOADER V4.2]
            </span>
            <span className="text-slate-300">[MEMORY: 640K OK]</span>
          </div>

          {/* Center Glowing Cyan Cyber-Sigilism Logo & Integrated NUTRITEC */}
          <div className="relative z-20 my-auto flex flex-col items-center text-center space-y-4 sm:space-y-6 py-4">
            
            {/* Cyber Sigil Organic Tribal Emblem Component */}
            <CyberSigilismNutritecLogo className="w-full max-w-lg sm:max-w-2xl" />

            {/* Small Orange Action Pill Button & Headphones Subtext */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                onClick={handleShatter}
                className="bg-[#ff5500] hover:bg-[#e04b00] text-white px-5 py-1.5 rounded text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase shadow-md transition active:scale-95 border border-orange-400"
              >
                CLICK TO ENTER
              </button>
              
              <p className="text-[9px] font-mono text-slate-300/80 tracking-[0.2em] uppercase font-semibold">
                (HEADPHONES RECOMMENDED)
              </p>
            </div>

          </div>

          {/* Bottom Status Bar */}
          <div className="relative z-20 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-300 tracking-[0.2em] uppercase border-t border-slate-400/20 pt-3">
            <span>{"[PROYECTO INTEGRADOR DE SISTEMAS // CRT MASTER PIPELINE]"}</span>
            <span className="hidden sm:block text-slate-200 font-bold">{"[STATUS: READY]"}</span>
          </div>

        </div>

      </div>
    </div>
  )
}

// Custom Video Player that falls back gracefully to a poster image
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

// Interactive Widescreen Showcase Video Component
function ScrollRevealVideo({ number, title, titleHover, subtitle, videoName, posterSrc, onOpenModal, soundEnabled }: any) {
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
        
        {/* Left Index */}
        <div className="hidden md:block w-28 text-left font-mono text-xs text-orange-500 tracking-widest">
          &#123;{number}&#125; //
        </div>

        {/* Widescreen CRT Video Card */}
        <div 
          ref={cardRef}
          onClick={onOpenModal}
          onMouseEnter={() => {
            setIsHovered(true)
            playRetroSound('hover', soundEnabled)
          }}
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
          
          {/* Overlay Gradients and Dynamic Text */}
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
            className={`btn-pixel-retro inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded bg-slate-900 border border-white/20 transition-all duration-300 ${
              isHovered 
                ? 'border-orange-500 text-orange-400' 
                : 'text-slate-400'
            }`}
          >
            INFO <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  )
}

// 3D Tilt Card Component with Motion Blur Drag & Mouse Velocity Acceleration
function TiltMonitorCard({ item, onOpenModal, soundEnabled }: { item: any; onOpenModal: () => void; soundEnabled: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0 })
  const [motionBlur, setMotionBlur] = useState(0)
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    // 3D Perspective Rotation calculation (-14deg to +14deg)
    const rotX = (y / (rect.height / 2)) * -14
    const rotY = (x / (rect.width / 2)) * 14
    setTilt({ rotX, rotY })

    // Motion Blur calculation based on cursor velocity
    const now = Date.now()
    const dt = Math.max(1, now - lastMousePos.current.time)
    const dx = e.clientX - lastMousePos.current.x
    const dy = e.clientY - lastMousePos.current.y
    const speed = Math.hypot(dx, dy) / dt

    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now }

    const blurAmount = Math.min(8, speed * 2.5)
    setMotionBlur(blurAmount)
  }

  const handleMouseLeave = () => {
    setTilt({ rotX: 0, rotY: 0 })
    setMotionBlur(0)
  }

  const IconComponent = item.icon

  return (
    <div
      ref={cardRef}
      onClick={() => {
        playRetroSound('click', soundEnabled)
        onOpenModal()
      }}
      onMouseEnter={() => playRetroSound('hover', soundEnabled)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(1.02, 1.02, 1.02)`,
        filter: motionBlur > 0.5 ? `blur(${motionBlur}px)` : 'none',
        transition: 'transform 0.12s ease-out, filter 0.15s ease-out'
      }}
      className="group relative rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:border-orange-500/80 transition duration-500 cursor-pointer overflow-hidden flex flex-col justify-between h-72 shadow-xl hover:shadow-[0_0_30px_rgba(255,85,0,0.25)] origin-center"
    >
      {/* Background image preview with blur scanlines */}
      <img 
        src={item.poster} 
        alt={item.title} 
        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-45 group-hover:scale-110 transition duration-700 pointer-events-none"
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-slate-400 uppercase tracking-widest">
        <span className="bg-orange-500 text-slate-950 px-2 py-0.5 font-bold rounded shadow-md">
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

      {/* Bottom Prompt & Retro Pixel Button */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-400 font-mono">
        <span>TAP TO OPEN</span>
        <span className="btn-pixel-retro px-3 py-1 bg-slate-950 text-orange-400 font-bold border border-orange-500/40 rounded uppercase tracking-wider group-hover:bg-orange-500 group-hover:text-slate-950 transition">
          INFO &rarr;
        </span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true)
  const [scanlinesActive, setScanlinesActive] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null)
  const [activeModalIndex, setActiveModalIndex] = useState<number>(0)

  const heroContainerRef = useRef<HTMLDivElement>(null)
  const crtScreenRef = useRef<HTMLDivElement>(null)
  const heroBadgeRef = useRef<HTMLSpanElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroTextRef = useRef<HTMLParagraphElement>(null)
  const heroCtaRef = useRef<HTMLDivElement>(null)
  const specGridRef = useRef<HTMLDivElement>(null)

  const heroVideoUrl = `${getMediaUrl('videos/1.mp4')}?v=2`

  // Interactive CRT Floating Monitor items
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

  const openModalItem = (item: any, idx: number) => {
    setActiveModalItem(item)
    setActiveModalIndex(idx)
  }

  const handleNextModal = () => {
    playRetroSound('click', soundEnabled)
    const nextIdx = (activeModalIndex + 1) % monitorGridItems.length
    setActiveModalIndex(nextIdx)
    setActiveModalItem(monitorGridItems[nextIdx])
  }

  const handlePrevModal = () => {
    playRetroSound('click', soundEnabled)
    const prevIdx = (activeModalIndex - 1 + monitorGridItems.length) % monitorGridItems.length
    setActiveModalIndex(prevIdx)
    setActiveModalItem(monitorGridItems[prevIdx])
  }

  // GSAP CRT Power-On Intro Timeline Sequence
  useGSAP(() => {
    if (showSplash) return

    playRetroSound('boot', soundEnabled)

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
  }, { scope: heroContainerRef, dependencies: [showSplash] })

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
    <>
      {/* Intro Terminal Shatter Splash Screen */}
      {showSplash && (
        <CanvasShatterSplash 
          onFinish={() => setShowSplash(false)} 
          soundEnabled={soundEnabled} 
        />
      )}

      <div ref={heroContainerRef} className="min-h-screen bg-black text-slate-100 font-mono selection:bg-orange-500 selection:text-black p-2 sm:p-4 md:p-6 relative">
        
        {/* Outer CRT Bezel Container (Curved Fisheye Frame like kvs.services) */}
        <div 
          ref={crtScreenRef}
          className="relative min-h-[96vh] rounded-[2rem] sm:rounded-[3rem] border border-white/10 bg-slate-950 crt-screen-bevel overflow-hidden flex flex-col justify-between crt-flicker"
        >
          {/* CRT Scanlines Texture Overlay */}
          {scanlinesActive && (
            <div className="pointer-events-none absolute inset-0 z-40 crt-scanlines opacity-40 mix-blend-overlay" />
          )}

          {/* Top Technical Bracket Navigation Header */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase">
              
              {/* Logo with technical brackets & Chromatic text */}
              <Link 
                to="/" 
                onClick={() => playRetroSound('click', soundEnabled)}
                className="flex items-center gap-3 text-white font-bold text-sm tracking-widest hover:text-emerald-400 transition"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500 text-slate-950 font-black text-xs">
                  N
                </span>
                <span className="crt-chromatic-text">&#123;NUTRITEC / CLINIC&#125;</span>
              </Link>

              {/* Location tag */}
              <div className="hidden lg:flex items-center gap-2 text-slate-500">
                <span>&#123;GUAYAQUIL / ECUADOR&#125;</span>
              </div>

              {/* Toggles: Scanlines, Audio Synth & Status */}
              <div className="hidden sm:flex items-center gap-6">
                {/* Audio Synth Toggle */}
                <button 
                  onClick={() => {
                    setSoundEnabled(!soundEnabled)
                    playRetroSound('click', true)
                  }}
                  className="flex items-center gap-2 text-[9px] hover:text-white transition"
                  title="Alternar efectos de sonido Web Audio API"
                >
                  {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-orange-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
                  <span>&#123;AUDIO&#125;</span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${soundEnabled ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* CRT Scanlines Toggle */}
                <button 
                  onClick={() => {
                    setScanlinesActive(!scanlinesActive)
                    playRetroSound('click', soundEnabled)
                  }}
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
                <Link to="/login" onClick={() => playRetroSound('click', soundEnabled)} className="hover:text-white transition">
                  &#123;LOGIN&#125;
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => playRetroSound('click', soundEnabled)}
                  className="btn-pixel-retro bg-orange-500 text-slate-950 px-4 py-1.5 font-bold rounded hover:bg-orange-400 transition tracking-widest border border-orange-400"
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
                  className="text-4xl sm:text-6xl lg:text-7xl font-mono uppercase tracking-tight text-white leading-none crt-chromatic-text"
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
                    onClick={() => playRetroSound('click', soundEnabled)}
                    className="btn-pixel-retro bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded text-xs font-mono tracking-widest font-bold transition uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400"
                  >
                    Comienza Gratis <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#monitores"
                    onClick={() => playRetroSound('click', soundEnabled)}
                    className="btn-pixel-retro border border-white/20 hover:border-orange-500 text-slate-300 hover:text-orange-400 px-8 py-4 rounded text-xs font-mono tracking-widest font-bold transition uppercase bg-slate-900/60"
                  >
                    Explorar Monitores
                  </a>
                </div>

              </div>
            </div>
          </section>

          {/* Continuous Horizontal Ticker / Marquee Band */}
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

          {/* Interactive Floating Monitor Grid with 3D Tilt & Motion Blur */}
          <section id="monitores" className="py-24 border-b border-white/10 bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <span className="text-orange-500 text-[10px] tracking-[0.3em] uppercase font-bold">
                    &#123;SYSTEM MODULES // 3D TILT GALLERY&#125;
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-mono uppercase tracking-tight text-white mt-2 crt-chromatic-text">
                    Monitores del Consultorio
                  </h2>
                </div>
                <p className="text-xs text-slate-400 max-w-md font-sans">
                  Mueve el cursor sobre las tarjetas para experimentar la perspectiva 3D interactiva y haz clic para ampliar en alta definición.
                </p>
              </div>

              {/* Grid of 6 interactive 3D Tilt screens */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {monitorGridItems.map((item, idx) => (
                  <TiltMonitorCard 
                    key={item.id} 
                    item={item} 
                    onOpenModal={() => openModalItem(item, idx)} 
                    soundEnabled={soundEnabled}
                  />
                ))}
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
                  onOpenModal={() => openModalItem(monitorGridItems[0], 0)}
                  soundEnabled={soundEnabled}
                />
                <ScrollRevealVideo 
                  number="02"
                  title="EVALUACIÓN ANTROPOMÉTRICA"
                  titleHover="PROGRESO CORPORAL"
                  subtitle="Control diario y composición corporal"
                  subtitleHover="[ PESO · COMPOSICIÓN · AGUA ]"
                  videoName="3.mp4"
                  posterSrc="/assets/service_gym.png"
                  onOpenModal={() => openModalItem(monitorGridItems[1], 1)}
                  soundEnabled={soundEnabled}
                />
                <ScrollRevealVideo 
                  number="03"
                  title="RECETAS INTELIGENTES"
                  titleHover="RECETARIO EN VIDEO"
                  subtitle="Instrucciones en video y porciones exactas"
                  subtitleHover="[ PASOS EN VIDEO · PORCIONES EXACTAS ]"
                  videoName="4.mp4"
                  posterSrc="/assets/service_recipe.png"
                  onOpenModal={() => openModalItem(monitorGridItems[2], 2)}
                  soundEnabled={soundEnabled}
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
                <h2 className="text-3xl sm:text-5xl font-mono uppercase tracking-tight text-white crt-chromatic-text">
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
                  <h2 className="text-3xl sm:text-5xl font-mono uppercase tracking-tight text-white leading-none crt-chromatic-text">
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
                  <form onSubmit={(e) => { e.preventDefault(); playRetroSound('click', soundEnabled); const btn = e.currentTarget.querySelector('button'); if (btn) { btn.innerText = '¡MENSAJE ENVIADO!'; btn.disabled = true; } }} className="space-y-4">
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
                    <button type="submit" className="btn-pixel-retro w-full bg-orange-500 hover:bg-orange-400 text-slate-950 rounded-xl py-3 text-xs font-bold tracking-widest transition-all uppercase border border-orange-400">
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

        {/* Interactive Modal Zoom View for Floating Monitor with Retro Navigation Controls */}
        {activeModalItem && (
          <div className="fixed inset-0 z-[9000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl rounded-3xl border border-orange-500/50 bg-slate-950 p-6 sm:p-8 shadow-[0_0_60px_rgba(255,85,0,0.25)] overflow-hidden flex flex-col gap-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-500 text-slate-950 font-bold px-2 py-0.5 text-xs rounded">
                    &#123;MODULE {activeModalItem.id}&#125;
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-wider uppercase">
                    {activeModalItem.title}
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    playRetroSound('click', soundEnabled)
                    setActiveModalItem(null)
                  }}
                  className="h-9 w-9 rounded-full border border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video / Content Display */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
                <video 
                  src={`${getMediaUrl(`videos/${activeModalItem.video}`)}?v=2`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-6 flex items-end">
                  <p className="text-xs sm:text-sm text-slate-200 font-sans max-w-xl leading-relaxed bg-slate-950/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    {activeModalItem.desc}
                  </p>
                </div>
              </div>

              {/* Modal Retro Control Buttons ("INFO", "NEXT", "BACK HOME") */}
              <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 gap-4">
                <span className="text-[10px] text-slate-500 tracking-widest font-mono">
                  NUTRITEC CLINICAL SYSTEM // MONITOR {activeModalItem.id} OF 06
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={handlePrevModal}
                    className="btn-pixel-retro bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold px-4 py-2 rounded uppercase tracking-widest border border-white/20 transition flex items-center gap-1"
                  >
                    &larr; PREV
                  </button>

                  <button 
                    onClick={handleNextModal}
                    className="btn-pixel-retro bg-slate-900 hover:bg-slate-800 text-orange-400 text-xs font-mono font-bold px-4 py-2 rounded uppercase tracking-widest border border-orange-500/40 transition flex items-center gap-1"
                  >
                    NEXT &rarr;
                  </button>

                  <button 
                    onClick={() => {
                      playRetroSound('click', soundEnabled)
                      setActiveModalItem(null)
                    }}
                    className="btn-pixel-retro bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-mono font-bold px-6 py-2 rounded uppercase tracking-widest border border-orange-400 transition"
                  >
                    BACK HOME
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  )
}
