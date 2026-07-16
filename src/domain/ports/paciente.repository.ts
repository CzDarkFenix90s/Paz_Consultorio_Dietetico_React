// src/domain/ports/paciente.repository.ts
import type { Paciente } from '../entities/user.entity'

export interface IPacienteRepository {
  getAll(filters?: { status?: string; search?: string }): Promise<Paciente[]>
  getById(id: number): Promise<Paciente>
  create(data: Partial<Paciente>): Promise<Paciente>
  update(id: number, data: Partial<Paciente>): Promise<Paciente>
  delete(id: number): Promise<void>
}
