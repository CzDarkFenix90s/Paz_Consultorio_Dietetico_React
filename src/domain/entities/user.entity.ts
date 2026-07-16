// src/domain/entities/user.entity.ts
import { UserRole } from '../enums/role.enum'

export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role: UserRole
  is_staff: boolean
  is_verified: boolean
}

export interface Paciente {
  id: number
  user_id?: number | null
  patient_code: string
  first_name: string
  last_name: string
  full_name: string
  age?: number | null
  goal?: string
  dietary_restrictions?: string
  current_weight?: string | number | null
  height_cm?: string | number | null
  status: 'activo' | 'inactivo'
  medical_notes?: string
  bmi?: number | null
  num_seguimientos?: number
  created_at?: string
  updated_at?: string
}

export interface PlanNutricional {
  id: number
  name: string
  description?: string
  goal?: string
  target_calories?: number | string
  duration_weeks?: number | string
  estimated_cost?: string | number
  is_active: boolean
  total_alimentos?: number
  created_at?: string
}

export interface ProgresoFoto {
  id: number
  paciente_id: number
  foto: string
  descripcion: string
  fecha_subida: string
}
