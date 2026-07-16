// src/domain/ports/auth.repository.ts
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../application/dtos/auth.dto'
import type { User } from '../entities/user.entity'

export interface IAuthRepository {
  login(credentials: LoginRequest): Promise<LoginResponse>
  register(data: RegisterRequest): Promise<RegisterResponse>
  logout(refreshToken: string): Promise<void>
  verifyEmail(code: string): Promise<void>
  getProfile(): Promise<User>
}
