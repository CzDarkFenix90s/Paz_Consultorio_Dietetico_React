// src/presentation/pages/public/LandingPage.tsx
import { Link } from 'react-router-dom'
import { 
  ShieldPlus, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  TrendingUp,
  Droplet,
  Flame,
  Calendar
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldPlus className="h-5.5 w-5.5" />
            </span>
            Consultorio <span className="text-emerald-400">Dietético</span>
          </Link>
          
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#beneficios" className="text-sm font-medium text-slate-400 transition hover:text-white">Beneficios</a>
            <a href="#servicios" className="text-sm font-medium text-slate-400 transition hover:text-white">Servicios</a>
            <a href="#contacto" className="text-sm font-medium text-slate-400 transition hover:text-white">Contacto</a>
          </nav>

          <div className="flex items-center gap-4">
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Tu salud inteligente empieza hoy
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
                Alcanza tu mejor versión con <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">planes nutricionales</span> a tu medida.
              </h1>
              <p className="text-lg leading-8 text-slate-400 max-w-xl">
                En nuestro Consultorio Dietético fusionamos la ciencia de la nutrición con tecnología intuitiva para crear planes alimenticios personalizados que realmente se adapten a tu estilo de vida.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-base font-bold text-slate-950 hover:scale-105 active:scale-95 transition shadow-lg shadow-emerald-500/20"
                >
                  Comienza Gratis
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <a
                  href="#servicios"
                  className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/10 hover:border-white/20 transition"
                >
                  Ver Servicios
                </a>
              </div>
            </div>

            {/* Right Side: Animated Application Dashboard Mockup */}
            <div className="relative animate-slide-up">
              {/* Decorative glows */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur-xl pointer-events-none" />
              
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                
                {/* Mockup Top Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <ShieldPlus className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Mi Portal de Salud</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Paciente Conectado
                  </span>
                </div>

                {/* Grid Layout of mockup stats */}
                <div className="grid gap-4 sm:grid-cols-2">
                  
                  {/* Calorie Card */}
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <span>CALORÍAS DIARIAS</span>
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1,850 kcal</div>
                      <div className="text-[10px] text-slate-500 mt-1">Consumo recomendado</div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-orange-500 rounded-full" />
                    </div>
                  </div>

                  {/* Water intake Card */}
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <span>AGUA E HIDRATACIÓN</span>
                      <Droplet className="h-4 w-4 text-sky-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1.2 L / 2.0 L</div>
                      <div className="text-[10px] text-slate-500 mt-1">Progreso diario</div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-sky-500 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Weight progress graph simulation */}
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 sm:col-span-2 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <span>SEGUIMIENTO DE PESO</span>
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex items-end justify-between h-20 pt-4 px-2">
                      <div className="w-8 bg-slate-800 h-16 rounded-t-lg text-center text-[10px] text-slate-500 pt-1">82kg</div>
                      <div className="w-8 bg-slate-800 h-14 rounded-t-lg text-center text-[10px] text-slate-500 pt-1">80kg</div>
                      <div className="w-8 bg-slate-700 h-12 rounded-t-lg text-center text-[10px] text-slate-400 pt-1">79kg</div>
                      <div className="w-8 bg-emerald-500/80 h-10 rounded-t-lg text-center text-[10px] text-white pt-1">78kg</div>
                    </div>
                  </div>

                  {/* Scheduled consultation Card */}
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 sm:col-span-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Siguiente Cita de Control</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Lunes, 24 de Julio - Dra. Maria Cosio</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">En 8 días</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section with Premium Curated Images and Animations */}
      <section id="servicios" className="py-24 border-t border-white/5 bg-slate-900/20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Nuestros Servicios</h2>
            <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Soluciones Clínicas y Deportivas</p>
            <p className="text-lg text-slate-400">
              Explora las herramientas diseñadas para guiar tu cambio de hábitos de forma visual, profesional e interactiva.
            </p>
          </div>

          {/* Grid of highly visual cards with Unsplash photos */}
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Dietas Personalizadas',
                description: 'Cálculo preciso de macros y calorías según tus objetivos de pérdida de peso, masa muscular o condiciones de salud clínica.',
                image: '/assets/service_diet.png',
                badge: 'Gourmet y Saludable',
                colorGlow: 'group-hover:shadow-emerald-500/20 group-hover:border-emerald-500/45'
              },
              {
                title: 'Seguimiento de Progreso',
                description: 'Línea de tiempo con fotos de progreso físico, control antropométrico y metas de agua integradas en tu perfil privado.',
                image: '/assets/service_gym.png',
                badge: 'Evaluación Corporal',
                colorGlow: 'group-hover:shadow-cyan-500/20 group-hover:border-cyan-500/45'
              },
              {
                title: 'Recetas Saludables',
                description: 'Catálogo de preparaciones sencillas creadas por nutricionistas que te demuestran que comer sano también es delicioso.',
                image: '/assets/service_recipe.png',
                badge: 'Preparación y Cocina',
                colorGlow: 'group-hover:shadow-teal-500/20 group-hover:border-teal-500/45'
              }
            ].map((service) => (
              <article 
                key={service.title} 
                className={`group relative rounded-3xl border border-white/5 bg-slate-900/40 overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col ${service.colorGlow}`}
              >
                {/* Image Container with zoom hover */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-slate-950/40 z-10 transition group-hover:bg-slate-950/20" />
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  />
                  <span className="absolute top-4 left-4 z-20 inline-flex rounded-full bg-slate-950/70 backdrop-blur-md px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {service.badge}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Subtle link animation */}
                  <Link 
                    to="/register"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-widest group-hover:text-emerald-300 transition"
                  >
                    Quiero este Plan
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Por qué elegirnos</h2>
            <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Tu bienestar, estructurado y bajo control</p>
            <p className="text-lg text-slate-400">Diseñado tanto para pacientes como para profesionales de la nutrición, optimizando la consulta y el cumplimiento dietético.</p>
          </div>

          <div className="grid gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Nutrición Científica', desc: 'Planes validados por profesionales basados en evaluaciones clínicas y antropométricas.' },
              { title: 'Plataforma Interactiva', desc: 'Acceso privado para registrar tu consumo de agua, comidas y síntomas diarios.' },
              { title: 'Panel de Especialistas', desc: 'Asignación de nutricionistas dedicados que controlan y editan tus rutinas y dietas.' },
              { title: 'Control de Alimentos', desc: 'Catálogos y categorías estructuradas para evitar la desorganización de ingredientes.' },
              { title: 'Seguridad JWT', desc: 'Autenticación encriptada para mantener tu historial clínico e información de salud 100% privada.' },
              { title: 'Evidencia Visual', desc: 'Sube fotos de tu progreso directamente a nuestro servidor de manera totalmente privada.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-emerald-500/20 hover:bg-white/[0.04] transition">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl font-semibold text-white mt-4">{item.title}</h3>
                <p className="text-slate-400 mt-2 text-sm leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action & Contact */}
      <section id="contacto" className="py-24 border-t border-white/5 bg-slate-900/40 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight text-white">¿Tienes dudas? Ponte en contacto con nosotros</h2>
              <p className="text-lg text-slate-400">
                Estamos aquí para acompañarte en tu transformación física y alimentaria. Escríbenos o visítanos en nuestro consultorio físico.
              </p>
              <div className="space-y-4 text-slate-300">
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

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Déjanos tu mensaje</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado. ¡Nos contactaremos pronto!'); }} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Nombre</span>
                    <input type="text" required placeholder="Carlos" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500/60" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Correo</span>
                    <input type="email" required placeholder="carlos@gmail.com" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500/60" />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Mensaje</span>
                  <textarea rows={4} required placeholder="Hola, quisiera agendar una asesoría..." className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none focus:border-emerald-500/60 resize-none" />
                </label>
                <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3.5 font-bold text-slate-950 hover:bg-emerald-400 transition">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© 2026 Consultorio Dietético App. Todos los derechos reservados.</p>
          <p className="mt-2 text-slate-600">Desarrollado para el Proyecto Integrador de Sistemas.</p>
        </div>
      </footer>
    </div>
  )
}
