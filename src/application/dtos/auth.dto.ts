// src/application/dtos/auth.dto.ts
import { UserRole } from '../../domain/enums/role.enum'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user_id: number
  username: string
  email: string
  is_staff: boolean
  is_verified: boolean
  role: UserRole
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  password2: string
  first_name?: string
  last_name?: string
}

export interface RegisterResponse {
  access: string
  refresh: string
  user_id: number
  username: string
  email: string
  is_staff: boolean
  is_verified: boolean
  message?: string
}
