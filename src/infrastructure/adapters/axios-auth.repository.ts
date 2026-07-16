// src/infrastructure/adapters/axios-auth.repository.ts
import type { IAuthRepository } from '../../domain/ports/auth.repository'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../application/dtos/auth.dto'
import type { User } from '../../domain/entities/user.entity'
import { axiosClient } from '../http/axios-client'
import { UserRole } from '../../domain/enums/role.enum'

export class AxiosAuthRepository implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosClient.post<LoginResponse>('/auth/login/', {
      username: credentials.username,
      password: credentials.password,
    })
    return response.data
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosClient.post<RegisterResponse>('/auth/register/', {
      username: data.username,
      email: data.email,
      password: data.password,
      password2: data.password2,
      first_name: data.first_name ?? '',
      last_name: data.last_name ?? '',
    })
    return response.data
  }

  async logout(refreshToken: string): Promise<void> {
    await axiosClient.post('/auth/logout/', {
      refresh: refreshToken,
    })
  }

  async verifyEmail(code: string): Promise<void> {
    await axiosClient.post('/auth/verify-email/', { code })
  }

  async getProfile(): Promise<User> {
    const response = await axiosClient.get('/users/profile/')
    const data = response.data
    // Map response profile format to User domain entity
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role as UserRole,
      is_staff: data.role === 'admin',
      is_verified: true, // If profile is loaded, session works
    }
  }
}
