import AuthShell from './AuthShell'

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Módulo 3 · Registro"
      title="Crea tu cuenta y empieza a cuidar tu nutrición"
      description="Regístrate como paciente, nutricionista o administrador con un flujo alineado al proyecto."
      footerPrompt="¿Ya tienes una cuenta?"
      footerLinkLabel="Inicia sesión"
      footerLinkTo="/login"
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Empezar</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Registro</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Crea tu perfil en menos de un minuto.</p>
        </div>

        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Nombre</span>
              <input
                type="text"
                name="firstName"
                placeholder="Ana"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-black/30"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Apellido</span>
              <input
                type="text"
                name="lastName"
                placeholder="Gómez"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-black/30"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">Correo electrónico</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-black/30"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Contraseña</span>
              <input
                type="password"
                name="password"
                placeholder="Crea una contraseña"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-black/30"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Confirmar contraseña</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repite la contraseña"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-black/30"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">Tipo de cuenta</span>
            <select className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-300/60 focus:bg-black/30">
              <option>Paciente</option>
              <option>Nutricionista</option>
              <option>Administrador</option>
            </select>
          </label>

          <label className="flex items-start gap-3 text-sm text-slate-400">
            <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-black/20 text-emerald-400 focus:ring-emerald-300" />
            <span>Acepto los términos y la política de privacidad.</span>
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
          >
            Crear cuenta
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          El registro está listo para conectarse con el backend de Django.
        </div>
      </div>
    </AuthShell>
  )
}