// src/application/use-cases/auth.use-cases.ts
import type { IAuthRepository } from '../../domain/ports/auth.repository'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../dtos/auth.dto'
import type { User } from '../../domain/entities/user.entity'

export class LoginUseCase {
  private authRepository: IAuthRepository
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }

  async execute(credentials: LoginRequest): Promise<LoginResponse> {
    return this.authRepository.login(credentials)
  }
}

export class RegisterUseCase {
  private authRepository: IAuthRepository
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }

  async execute(data: RegisterRequest): Promise<RegisterResponse> {
    return this.authRepository.register(data)
  }
}

export class LogoutUseCase {
  private authRepository: IAuthRepository
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }

  async execute(refreshToken: string): Promise<void> {
    return this.authRepository.logout(refreshToken)
  }
}

export class VerifyEmailUseCase {
  private authRepository: IAuthRepository
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }

  async execute(code: string): Promise<void> {
    return this.authRepository.verifyEmail(code)
  }
}

export class GetProfileUseCase {
  private authRepository: IAuthRepository
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }

  async execute(): Promise<User> {
    return this.authRepository.getProfile()
  }
}
