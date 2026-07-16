// src/application/use-cases/auth.use-cases.ts
import type { IAuthRepository } from '../../domain/ports/auth.repository'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../dtos/auth.dto'
import type { User } from '../../domain/entities/user.entity'

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginRequest): Promise<LoginResponse> {
    return this.authRepository.login(credentials)
  }
}

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterRequest): Promise<RegisterResponse> {
    return this.authRepository.register(data)
  }
}

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(refreshToken: string): Promise<void> {
    return this.authRepository.logout(refreshToken)
  }
}

export class VerifyEmailUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(code: string): Promise<void> {
    return this.authRepository.verifyEmail(code)
  }
}

export class GetProfileUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<User> {
    return this.authRepository.getProfile()
  }
}
