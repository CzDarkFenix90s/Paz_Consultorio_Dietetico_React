import type { ReactNode } from 'react'

type ModelRow = {
  model: string
  summary: string
  fields: string
  relations: string
}

type ModelGroup = {
  id: string
  title: string
  description: string
  accent: string
  rows: ModelRow[]
}

const modelGroups: ModelGroup[] = [
  {
    id: 'identity',
    title: 'Core identity',
    description: 'Patients, nutritionists and the supporting clinical profile tables.',
    accent: 'from-cyan-400/20 via-sky-400/10 to-transparent',
    rows: [
      {
        model: 'Paciente',
        summary: 'Patient master record with goals, weight and status.',
        fields: 'user, patient_code, first_name, last_name, age, goal, dietary_restrictions, current_weight, height_cm, status',
        relations: 'User, HistorialClinico, SeguimientoNutricional, ConsultaDietetica, RegistroEjercicio, SeguimientoConsumo, ProgresoFoto',
      },
      {
        model: 'Nutricionista',
        summary: 'Professional profile for the nutrition staff.',
        fields: 'user, first_name, last_name, professional_id, specialty, consultation_fee, consultations_completed, is_active',
        relations: 'User, HorarioNutricionista, ConsultaDietetica',
      },
      {
        model: 'UserProfile',
        summary: 'Extended user metadata and role-specific profile data.',
        fields: 'perfil, rol, estado, avatar, preferencias',
        relations: 'User',
      },
      {
        model: 'HistorialClinico',
        summary: 'Clinical history and relevant medical background.',
        fields: 'paciente, alergias, enfermedades_cronicas, antecedentes_familiares, medicamentos_actuales',
        relations: 'Paciente',
      },
      {
        model: 'EvaluacionAntropometrica',
        summary: 'Body measurements and anthropometric evaluations.',
        fields: 'medidas corporales, IMC, grasa corporal, observaciones, fecha',
        relations: 'Paciente',
      },
      {
        model: 'ObjetivoPaciente',
        summary: 'Patient goals and progress targets.',
        fields: 'paciente, objetivo, prioridad, fecha_inicio, fecha_fin',
        relations: 'Paciente',
      },
      {
        model: 'PreferenciaAlimentaria',
        summary: 'Food preferences, exclusions and tolerances.',
        fields: 'paciente, favoritos, intolerancias, exclusiones',
        relations: 'Paciente',
      },
      {
        model: 'LogroPaciente',
        summary: 'Achievement milestones for motivation and progress.',
        fields: 'paciente, descripcion, puntos, fecha',
        relations: 'Paciente',
      },
    ],
  },
  {
    id: 'planning',
    title: 'Diet planning',
    description: 'Plans, consultations, meal blocks and food catalog tables.',
    accent: 'from-emerald-400/20 via-teal-400/10 to-transparent',
    rows: [
      {
        model: 'PlanNutricional',
        summary: 'Reusable nutrition plan with calories and duration.',
        fields: 'name, description, goal, target_calories, duration_weeks, estimated_cost, is_active',
        relations: 'ConsultaDietetica, RutinaEjercicio, DiaPlan',
      },
      {
        model: 'ConsultaDietetica',
        summary: 'Scheduled consultation linking patient, plan and nutritionist.',
        fields: 'status, session_notes, scheduled_time, estimated_end, plan_nutricional, paciente, nutricionista',
        relations: 'PlanNutricional, Paciente, Nutricionista',
      },
      {
        model: 'DiaPlan',
        summary: 'Daily plan container for menu organization.',
        fields: 'plan_nutricional, fecha, orden_dia, notas',
        relations: 'PlanNutricional, DetallePlanAlimento, AlimentoProgramado',
      },
      {
        model: 'DetallePlanAlimento',
        summary: 'Detailed meal line items for each planned day.',
        fields: 'dia_plan, alimento, cantidad, momento_comida, calorias',
        relations: 'DiaPlan, MomentoComida',
      },
      {
        model: 'AlimentoProgramado',
        summary: 'Scheduled food assignment for a specific plan slot.',
        fields: 'dia_plan, alimento, cantidad, momento_comida, estado',
        relations: 'DiaPlan, MomentoComida, CategoriaAlimento',
      },
      {
        model: 'MomentoComida',
        summary: 'Meal moment catalog such as breakfast, lunch or snack.',
        fields: 'nombre, descripcion, created_at',
        relations: 'DetallePlanAlimento, AlimentoProgramado, SeguimientoConsumo',
      },
      {
        model: 'CategoriaAlimento',
        summary: 'Food category lookup table.',
        fields: 'nombre, descripcion, estado, created_at, updated_at',
        relations: 'AlimentoProgramado',
      },
      {
        model: 'NotaConsulta',
        summary: 'Clinical notes attached to a consultation.',
        fields: 'consulta_dietetica, nota, visibilidad, created_at',
        relations: 'ConsultaDietetica',
      },
    ],
  },
  {
    id: 'tracking',
    title: 'Tracking',
    description: 'Follow-up tables for nutrition, water, exercise, symptoms and photos.',
    accent: 'from-amber-400/20 via-orange-400/10 to-transparent',
    rows: [
      {
        model: 'SeguimientoNutricional',
        summary: 'Weight and waist follow-up over time.',
        fields: 'paciente, weight_kg, waist_cm, notes, created_at',
        relations: 'Paciente',
      },
      {
        model: 'RegistroAgua',
        summary: 'Daily water intake tracking.',
        fields: 'paciente, fecha, cantidad_ml, meta_ml, notas',
        relations: 'Paciente',
      },
      {
        model: 'SintomaDiario',
        summary: 'Daily symptom logging and intensity tracking.',
        fields: 'paciente, fecha, sintoma, intensidad, observaciones',
        relations: 'Paciente',
      },
      {
        model: 'ProgresoFoto',
        summary: 'Before-and-after or progress photos.',
        fields: 'paciente, foto, fecha, descripcion',
        relations: 'Paciente',
      },
      {
        model: 'RegistroEjercicio',
        summary: 'Completed workout log for a patient routine.',
        fields: 'paciente, rutina_ejercicio, fecha, completado, notas',
        relations: 'Paciente, RutinaEjercicio',
      },
      {
        model: 'RutinaEjercicio',
        summary: 'Exercise routine attached to a nutrition plan.',
        fields: 'plan_nutricional, descripcion_rutina, dias_semana, duracion_minutos',
        relations: 'PlanNutricional, RegistroEjercicio',
      },
      {
        model: 'SeguimientoConsumo',
        summary: 'Meal compliance follow-up by day and meal moment.',
        fields: 'paciente, momento_comida, fecha, completado, notas',
        relations: 'Paciente, MomentoComida',
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations and communication',
    description: 'Messaging, scheduling and billing support tables.',
    accent: 'from-fuchsia-400/20 via-violet-400/10 to-transparent',
    rows: [
      {
        model: 'MensajeChat',
        summary: 'Conversation message between app users.',
        fields: 'emisor, receptor, mensaje, leido, created_at',
        relations: 'User, UserProfile',
      },
      {
        model: 'NotificacionPush',
        summary: 'Push notification queue and delivery state.',
        fields: 'titulo, cuerpo, tipo, leida, created_at',
        relations: 'User, UserProfile',
      },
      {
        model: 'FacturaPago',
        summary: 'Billing and payment tracking.',
        fields: 'paciente, monto, estado, metodo_pago, fecha_emision',
        relations: 'Paciente, ConsultaDietetica',
      },
      {
        model: 'HorarioNutricionista',
        summary: 'Weekly availability slots for each nutritionist.',
        fields: 'nutricionista, dia_semana, hora_inicio, hora_fin, is_active',
        relations: 'Nutricionista',
      },
    ],
  },
]

const totalModels = modelGroups.reduce((count, group) => count + group.rows.length, 0)

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-slate-200">
      {children}
    </span>
  )
}

function ModelTable({ group }: { group: ModelGroup }) {
  return (
    <section id={group.id} className="scroll-mt-8 rounded-3xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className={`mb-4 rounded-2xl bg-gradient-to-r ${group.accent} p-4`}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300/80">{group.title}</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{group.title}</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">{group.description}</p>
          </div>
          <Pill>{group.rows.length} models</Pill>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 bg-[#0b1220] text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="border-b border-white/10 px-4 py-3">Model</th>
                <th className="border-b border-white/10 px-4 py-3">Summary</th>
                <th className="border-b border-white/10 px-4 py-3">Key fields</th>
                <th className="border-b border-white/10 px-4 py-3">Relations</th>
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row, index) => (
                <tr key={row.model} className={index % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.01]'}>
                  <td className="border-b border-white/5 px-4 py-4 align-top text-white">
                    <div className="font-semibold">{row.model}</div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top text-slate-300">{row.summary}</td>
                  <td className="border-b border-white/5 px-4 py-4 align-top text-slate-200">{row.fields}</td>
                  <td className="border-b border-white/5 px-4 py-4 align-top text-slate-400">{row.relations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default function AdminModelsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.18),_transparent_28%),linear-gradient(180deg,_#07101d_0%,_#0a1323_40%,_#04070d_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Pill>Dietetic schema dashboard</Pill>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Backend tables from Proyecto Integrador Dieta, mapped into the React admin shell.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                This page groups the Django models into the same business areas the backend uses so the front end can grow around the real data model instead of placeholder screens.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[22rem] lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-3xl font-semibold text-white">{totalModels}</div>
                <div className="mt-1 text-sm text-slate-400">Django models represented</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-3xl font-semibold text-white">4</div>
                <div className="mt-1 text-sm text-slate-400">Functional groups</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-3xl font-semibold text-white">1</div>
                <div className="mt-1 text-sm text-slate-400">Admin route ready</div>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6 text-sm text-slate-300">
            {modelGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
              >
                {group.title}
              </a>
            ))}
          </nav>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modelGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{group.rows.length} tables</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{group.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{group.description}</p>
            </a>
          ))}
        </div>

        <div className="space-y-8">
          {modelGroups.map((group) => (
            <ModelTable key={group.id} group={group} />
          ))}
        </div>
      </div>
    </main>
  )
}