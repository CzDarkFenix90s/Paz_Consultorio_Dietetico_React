import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#07101d_0%,_#0b1322_42%,_#04070d_100%)] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_35%,transparent_65%,rgba(255,255,255,0.05))]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300/80">{eyebrow}</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-2xl font-semibold text-white">Secure</div>
                <div className="mt-1 text-sm text-slate-400">JWT-ready auth flow</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-2xl font-semibold text-white">Fast</div>
                <div className="mt-1 text-sm text-slate-400">Simple entry points</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-2xl font-semibold text-white">Ready</div>
                <div className="mt-1 text-sm text-slate-400">Connect to backend later</div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0a1220]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:p-6">
              {children}

              <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-300">
                <span>{footerPrompt} </span>
                <Link to={footerLinkTo} className="font-medium text-cyan-300 transition hover:text-cyan-200">
                  {footerLinkLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}