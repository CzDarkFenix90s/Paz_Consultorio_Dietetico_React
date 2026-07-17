import { Link } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  MapPin,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#000000] text-white font-mono selection:bg-[#D60001] selection:text-white relative overflow-hidden">
      
      {/* Cinematic Grid Lines Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Glow highlight */}
      <div className="absolute top-[-10%] right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-[#D60001]/10 blur-[150px] pointer-events-none" />

      {/* Industrial Thin Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#D60001]/25 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-lg font-black tracking-[0.25em] text-white hover:text-[#D60001] transition-colors">
            <span className="text-[#D60001] font-black">●</span> NUTRI_TEC
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

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 border-b border-[#D60001]/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-10">
              <span className="text-[11px] font-bold tracking-[0.45em] text-[#D60001] uppercase block">
                [ INDUSTRIAL NUTRITION & CLINICAL KINETICS ]
              </span>
              
              <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-[5.5rem] leading-[0.9] uppercase">
                NUTRICIÓN <br />
                DE PRECISIÓN <br />
                A TU MEDIDA
              </h1>

              <div className="w-20 h-[2px] bg-[#D60001]" />

              <p className="text-xs leading-relaxed text-slate-400 max-w-lg tracking-wider font-semibold">
                [ EDICIÓN 2026 // FUSIONAMOS LA CIENCIA DIETÉTICA MOLECULAR CON MONITOREO ANTRÓPOMETRICO EN TIEMPO REAL. DISEÑADO PARA QUIENES EXIGEN MÁXIMO RENDIMIENTO Y BIENESTAR BAJO CONTROL ABSOLUTO. ]
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 bg-[#D60001] hover:bg-[#b00000] px-8 py-4 text-xs font-bold tracking-[0.2em] text-white transition-all shadow-lg shadow-[#D60001]/20 uppercase"
                >
                  Comienza Gratis
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="#servicios"
                  className="inline-flex items-center gap-3 border border-white/20 hover:border-white text-white px-8 py-4 text-xs font-bold tracking-[0.2em] transition-all uppercase"
                >
                  Ver Servicios
                </a>
              </div>
            </div>

            {/* Right Side: Cinematic Grid Stats Simulator */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D60001] to-[#ff4d4d] opacity-10 blur-xl pointer-events-none" />
              
              <div className="relative border border-[#D60001]/30 bg-black p-6 sm:p-8 space-y-8">
                
                <div className="flex items-center justify-between border-b border-[#D60001]/20 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#D60001]" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">[ CLINICAL_MONITOR_SYS ]</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#D60001] uppercase tracking-widest animate-pulse">
                    ONLINE
                  </span>
                </div>

                <div className="space-y-6">
                  
                  {/* Calorie Card */}
                  <div className="border border-white/10 bg-white/[0.01] p-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>01 / REQUERIMIENTO CALÓRICO</span>
                      <span className="text-[#D60001]">▲ 1,850 KCAL</span>
                    </div>
                    <div className="h-1 bg-slate-900 overflow-hidden">
                      <div className="h-full w-2/3 bg-[#D60001]" />
                    </div>
                  </div>

                  {/* Water intake Card */}
                  <div className="border border-white/10 bg-white/[0.01] p-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>02 / METAS DE HIDRATACIÓN</span>
                      <span className="text-[#D60001]">● 1.2 L / 2.0 L</span>
                    </div>
                    <div className="h-1 bg-slate-900 overflow-hidden">
                      <div className="h-full w-3/5 bg-[#D60001]" />
                    </div>
                  </div>

                  {/* Weight progress graph simulation */}
                  <div className="border border-white/10 bg-white/[0.01] p-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>03 / HISTORIAL CORPORAL</span>
                      <span className="text-[#D60001]">▼ -4 KG</span>
                    </div>
                    <div className="flex items-end justify-between h-14 pt-4 px-2">
                      <div className="w-8 bg-slate-900 h-12 text-center text-[8px] text-slate-500 pt-1">82kg</div>
                      <div className="w-8 bg-slate-900 h-10 text-center text-[8px] text-slate-500 pt-1">80kg</div>
                      <div className="w-8 bg-[#D60001]/40 h-8 text-center text-[8px] text-slate-400 pt-1">79kg</div>
                      <div className="w-8 bg-[#D60001] h-6 text-center text-[8px] text-white pt-1">78kg</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section with Cinematic Work Grid */}
      <section id="servicios" className="py-24 border-b border-[#D60001]/25 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-[11px] font-bold tracking-[0.45em] text-[#D60001] uppercase block">
              [ NUESTROS SERVICIOS // SOLUCIONES ]
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl leading-none">
              SOLUCIONES CLÍNICAS Y DEPORTIVAS
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed tracking-wider font-semibold">
              [ EXPLORA LAS METODOLOGÍAS Y MÓDULOS DIGITALES DESARROLLADOS PARA EL CONTROL ANTROPOMÉTRICO Y LA NUTRICIÓN DE ALTA COMPLEJIDAD. ]
            </p>
          </div>

          {/* Grid of highly visual cards with Unsplash photos */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                number: '01',
                title: 'DIETAS MOLECULARES',
                description: 'Cálculo analítico de macronutrientes adaptado a tus exigencias cardiovasculares y metas antropométricas.',
                image: '/assets/service_diet.png',
                badge: 'DESARROLLO Y SALUD'
              },
              {
                number: '02',
                title: 'CONTROL DE EVOLUCIÓN',
                description: 'Línea de tiempo visual, métricas de composición corporal y metas de hidratación en tiempo real.',
                image: '/assets/service_gym.png',
                badge: 'ESTADÍSTICA DIARIA'
              },
              {
                number: '03',
                title: 'RECETARIO INDUSTRIAL',
                description: 'Catálogo de preparaciones saludables detalladas con porciones exactas para evitar desorganización.',
                image: '/assets/service_recipe.png',
                badge: 'PLANIFICACIÓN KITCHEN'
              }
            ].map((service) => (
              <article 
                key={service.title} 
                className="group relative border border-white/10 bg-black overflow-hidden flex flex-col justify-between h-[420px] transition-all duration-300 hover:border-[#D60001]"
              >
                {/* Image Container with zoom hover */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-950/40 z-10 transition group-hover:bg-slate-950/20" />
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                  <span className="absolute top-4 left-4 z-20 border border-[#D60001]/30 bg-black px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#D60001]">
                    {service.badge}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#D60001] tracking-widest">{service.number} // PROGRAM</div>
                    <h3 className="text-lg font-black text-white group-hover:text-[#D60001] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      {service.description}
                    </p>
                  </div>
                  
                  <Link 
                    to="/register"
                    className="inline-flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-[#D60001] transition-colors"
                  >
                    Adquirir Plan
                    <ArrowUpRight className="h-4.5 w-4.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 border-b border-[#D60001]/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-[11px] font-bold tracking-[0.45em] text-[#D60001] uppercase block">
              [ POR QUÉ ELEGIRNOS // METRICAS ]
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase sm:text-5xl leading-none">
              TU BIENESTAR BAJO CONTROL ABSOLUTO
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed tracking-wider font-semibold">
              [ TECNOLOGÍA ENCRIPTADA, EVALUACIÓN CIENTÍFICA Y SEGUIMIENTO ACTIVO. ]
            </p>
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
              <div key={item.title} className="border border-white/10 bg-white/[0.01] p-6 hover:border-[#D60001]/40 transition duration-300">
                <div className="text-xs font-bold text-[#D60001]">{item.number} // SPECIFICATION</div>
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
              <p className="text-xs leading-relaxed text-slate-400 tracking-wider font-semibold max-w-md">
                [ ESTAMOS AQUÍ PARA ACOMPAÑARTE EN TU EVOLUCIÓN FÍSICA Y ALIMENTARIA. ESCRÍBENOS O VISÍTANOS EN NUESTRO CONSULTORIO. ]
              </p>
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
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">[ INTAKE_MESSAGE_BOX ]</h3>
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
                <button type="submit" className="w-full bg-[#D60001] hover:bg-[#b00000] py-4 text-xs font-bold tracking-[0.2em] text-white transition-all uppercase">
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
