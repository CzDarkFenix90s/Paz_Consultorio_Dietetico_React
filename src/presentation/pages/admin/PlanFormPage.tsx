// src/presentation/pages/admin/PlanFormPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePlanStore } from '../../store/usePlanStore'
import { ArrowLeft, Save, AlertCircle, Sparkles } from 'lucide-react'

export default function PlanFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const { activePlan, fetchPlanById, createPlan, updatePlan, loading, error, clearError } = usePlanStore()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: 'PERDIDA_PESO',
    target_calories: '',
    duration_weeks: '',
    estimated_cost: '',
    is_active: true,
  })

  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    clearError()
    setValidationError('')
    if (isEdit) {
      fetchPlanById(Number(id))
    }
  }, [id, isEdit])

  useEffect(() => {
    if (isEdit && activePlan) {
      setFormData({
        name: activePlan.name || '',
        description: activePlan.description || '',
        goal: activePlan.goal || 'PERDIDA_PESO',
        target_calories: activePlan.target_calories ? String(activePlan.target_calories) : '',
        duration_weeks: activePlan.duration_weeks ? String(activePlan.duration_weeks) : '',
        estimated_cost: activePlan.estimated_cost ? String(activePlan.estimated_cost) : '',
        is_active: activePlan.is_active,
      })
    }
  }, [activePlan, isEdit])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    clearError()
    setValidationError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setValidationError('El nombre del plan es obligatorio.')
      return
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || '',
      goal: formData.goal,
      target_calories: formData.target_calories ? Number(formData.target_calories) : undefined,
      duration_weeks: formData.duration_weeks ? Number(formData.duration_weeks) : undefined,
      estimated_cost: formData.estimated_cost ? Number(formData.estimated_cost) : 0,
      is_active: formData.is_active,
    }

    let success = false
    if (isEdit) {
      success = await updatePlan(Number(id), payload)
    } else {
      success = await createPlan(payload)
    }

    if (success) {
      alert(isEdit ? 'Plan nutricional actualizado correctamente.' : 'Plan nutricional creado correctamente.')
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <section className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Form Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
              title="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEdit ? 'Editar Plan Nutricional' : 'Nuevo Plan Nutricional'}
              </h1>
              <p className="text-xs text-slate-500">Define los macros, calorías y estructura básica del plan.</p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Planificación
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-600">Nombre del Plan *</span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej. Plan Keto Avanzado"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-600">Descripción</span>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe en qué consiste el plan nutricional..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition resize-none"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Calorías Objetivo (kcal)</span>
              <input
                type="number"
                name="target_calories"
                value={formData.target_calories}
                onChange={handleInputChange}
                placeholder="2000"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Duración (Semanas)</span>
              <input
                type="number"
                name="duration_weeks"
                value={formData.duration_weeks}
                onChange={handleInputChange}
                placeholder="4"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Costo Estimado ($)</span>
              <input
                type="number"
                name="estimated_cost"
                step="0.01"
                value={formData.estimated_cost}
                onChange={handleInputChange}
                placeholder="30.00"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Objetivo Clínico</span>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 bg-white transition"
              >
                <option value="PERDIDA_PESO">Pérdida de Peso / Grasa</option>
                <option value="AUMENTO_MUSCULO">Aumento de Masa Muscular</option>
                <option value="MANTENIMIENTO">Mantenimiento y Salud General</option>
                <option value="SALUD_CLINICA">Control de Patología / Dieta Clínica</option>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 select-none">
              El plan está activo y disponible para los pacientes
            </label>
          </div>

          {(validationError || error) && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-700 text-sm whitespace-pre-line">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 font-bold text-white hover:bg-emerald-400 disabled:opacity-50 transition shadow-md shadow-emerald-500/10"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEdit ? 'Actualizar Plan' : 'Guardar Plan'}
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  )
}
