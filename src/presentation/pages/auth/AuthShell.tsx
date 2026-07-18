import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Layers } from 'lucide-react'

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footerPrompt: string
  footerLinkLabel: string
  footerLinkTo: string
}

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow animations */}
      <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_1fr] items-center">
        
        {/* Left column: Brand & Feature list */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 lg:p-12 shadow-2xl backdrop-blur-xl h-full flex flex-col justify-between min-h-[450px]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-xs font-semibold text-emerald-400">
              {eyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase leading-[1.05]">
              {title}
            </h1>
            <p className="text-slate-400 leading-relaxed max-w-lg">
              {description}
            </p>
          </div>

          <div className="grid gap-4 mt-8 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-5 hover:border-emerald-500/20 transition duration-300">
              <ShieldCheck className="h-6 w-6 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">Seguro</div>
              <div className="mt-1 text-xs text-slate-500 leading-normal">Sesiones encriptadas con seguridad JWT.</div>
            </div>
            
            <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-5 hover:border-emerald-500/20 transition duration-300">
              <Zap className="h-6 w-6 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">Rápido</div>
              <div className="mt-1 text-xs text-slate-500 leading-normal">Acceso inmediato sin esperas complejas.</div>
            </div>
            
            <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-5 hover:border-emerald-500/20 transition duration-300">
              <Layers className="h-6 w-6 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">Conectado</div>
              <div className="mt-1 text-xs text-slate-500 leading-normal">Sincronización en tiempo real con tu nutricionista.</div>
            </div>
          </div>
        </section>

        {/* Right column: Form Card */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
            {children}

            <div className="mt-6 border-t border-white/5 pt-6 text-center text-sm text-slate-400">
              <span>{footerPrompt} </span>
              <Link to={footerLinkTo} className="font-bold text-emerald-400 transition hover:text-emerald-300 hover:underline underline-offset-4 decoration-2">
                {footerLinkLabel}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}