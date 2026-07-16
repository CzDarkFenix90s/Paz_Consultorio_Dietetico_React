// src/infrastructure/factories/paciente.factory.ts
import { AxiosPacienteRepository } from '../adapters/axios-paciente.repository'
import {
  GetPacientesUseCase,
  GetPacienteByIdUseCase,
  CreatePacienteUseCase,
  UpdatePacienteUseCase,
  DeletePacienteUseCase,
} from '../../application/use-cases/paciente.use-cases'

const repository = new AxiosPacienteRepository()

export const getPacientesUseCase = new GetPacientesUseCase(repository)
export const getPacienteByIdUseCase = new GetPacienteByIdUseCase(repository)
export const createPacienteUseCase = new CreatePacienteUseCase(repository)
export const updatePacienteUseCase = new UpdatePacienteUseCase(repository)
export const deletePacienteUseCase = new DeletePacienteUseCase(repository)
export { repository as pacienteRepository }
