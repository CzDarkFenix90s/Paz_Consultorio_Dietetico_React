// src/infrastructure/factories/auth.factory.ts
import { AxiosAuthRepository } from '../adapters/axios-auth.repository'
import {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  VerifyEmailUseCase,
  GetProfileUseCase,
} from '../../application/use-cases/auth.use-cases'

const authRepository = new AxiosAuthRepository()

export const loginUseCase = new LoginUseCase(authRepository)
export const registerUseCase = new RegisterUseCase(authRepository)
export const logoutUseCase = new LogoutUseCase(authRepository)
export const verifyEmailUseCase = new VerifyEmailUseCase(authRepository)
export const getProfileUseCase = new GetProfileUseCase(authRepository)
export { authRepository }
