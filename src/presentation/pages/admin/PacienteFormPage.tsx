// src/presentation/pages/admin/PacienteFormPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePacienteStore } from '../../store/usePacienteStore'
import { ArrowLeft, Save, AlertCircle, Sparkles } from 'lucide-react'

export default function PacienteFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const { activePaciente, fetchPacienteById, createPaciente, updatePaciente, loading, error, clearError } = usePacienteStore()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    patient_code: '',
    age: '',
    goal: 'PERDIDA_PESO',
    dietary_restrictions: '',
    current_weight: '',
    height_cm: '',
    status: 'activo' as 'activo' | 'inactivo',
    medical_notes: '',
    user_id_input: '',
  })

  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    clearError()
    setValidationError('')
    if (isEdit) {
      fetchPacienteById(Number(id))
    }
  }, [id, isEdit])

  const cleanHeight = (val: string) => {
    if (!val) return null
    const cleaned = parseFloat(String(val).replace(',', '.'))
    if (isNaN(cleaned)) return null
    // If they typed in meters (e.g. 1.59), convert to centimeters (159)
    if (cleaned < 3) {
      return Math.round(cleaned * 100)
    }
    return cleaned
  }

  const cleanWeight = (val: string) => {
    if (!val) return null
    const cleaned = parseFloat(String(val).replace(',', '.'))
    return isNaN(cleaned) ? null : cleaned
  }

  useEffect(() => {
    if (isEdit && activePaciente) {
      setFormData({
        first_name: activePaciente.first_name || '',
        last_name: activePaciente.last_name || '',
        patient_code: activePaciente.patient_code || '',
        age: activePaciente.age ? String(activePaciente.age) : '',
        goal: activePaciente.goal || 'PERDIDA_PESO',
        dietary_restrictions: activePaciente.dietary_restrictions || '',
        current_weight: activePaciente.current_weight ? String(activePaciente.current_weight) : '',
        height_cm: activePaciente.height_cm ? String(Number(activePaciente.height_cm) > 3 ? Number(activePaciente.height_cm) / 100 : activePaciente.height_cm).replace('.', ',') : '',
        status: activePaciente.status || 'activo',
        medical_notes: activePaciente.medical_notes || '',
        user_id_input: activePaciente.user_id ? String(activePaciente.user_id) : '',
      })
    }
  }, [activePaciente, isEdit])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    clearError()
    setValidationError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setValidationError('Nombre y Apellido son campos obligatorios.')
      return
    }

    const payload: any = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      patient_code: formData.patient_code.trim() || undefined,
      age: formData.age ? Number(formData.age) : null,
      goal: formData.goal,
      dietary_restrictions: formData.dietary_restrictions.trim() || '',
      current_weight: cleanWeight(formData.current_weight),
      height_cm: cleanHeight(formData.height_cm),
      status: formData.status,
      medical_notes: formData.medical_notes.trim() || '',
      user_id_input: formData.user_id_input ? Number(formData.user_id_input) : null,
    }

    let success = false
    if (isEdit) {
      success = await updatePaciente(Number(id), payload)
    } else {
      success = await createPaciente(payload)
    }

    if (success) {
      alert(isEdit ? 'Paciente actualizado correctamente.' : 'Paciente creado correctamente.')
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <section className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
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
                {isEdit ? 'Editar Paciente' : 'Nuevo Registro de Paciente'}
              </h1>
              <p className="text-xs text-slate-500">Completa la información médica y antropométrica del paciente.</p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Nutrición Clínica
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Nombre *</span>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Ana"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Apellido *</span>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Gómez"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Código de Paciente</span>
              <input
                type="text"
                name="patient_code"
                value={formData.patient_code}
                onChange={handleInputChange}
                placeholder="Ej. PAC-F329 (Autogenerado si vacío)"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Edad</span>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="28"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">ID de Usuario Django (Opcional)</span>
              <input
                type="number"
                name="user_id_input"
                value={formData.user_id_input}
                onChange={handleInputChange}
                placeholder="Ej. 5"
                min="1"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Peso Actual (kg)</span>
              <input
                type="number"
                name="current_weight"
                step="0.01"
                value={formData.current_weight}
                onChange={handleInputChange}
                placeholder="75.5"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Altura (cm)</span>
              <input
                type="number"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleInputChange}
                placeholder="175"
                min="0"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-600">Estado</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 bg-white transition"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
          </div>

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

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-600">Restricciones Alimenticias / Alergias</span>
            <textarea
              name="dietary_restrictions"
              rows={3}
              value={formData.dietary_restrictions}
              onChange={handleInputChange}
              placeholder="Intolerancia a la lactosa, alergia a los frutos secos, vegetariano, etc."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition resize-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-600">Notas Médicas / Diagnóstico</span>
            <textarea
              name="medical_notes"
              rows={3}
              value={formData.medical_notes}
              onChange={handleInputChange}
              placeholder="Comentarios adicionales, patologías preexistentes, etc."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 transition resize-none"
            />
          </label>

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
                {isEdit ? 'Actualizar Paciente' : 'Guardar Paciente'}
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  )
}
