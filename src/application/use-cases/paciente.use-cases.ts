// src/application/use-cases/paciente.use-cases.ts
import type { IPacienteRepository } from '../../domain/ports/paciente.repository'
import type { Paciente } from '../../domain/entities/user.entity'

export class GetPacientesUseCase {
  private repository: IPacienteRepository
  constructor(repository: IPacienteRepository) {
    this.repository = repository
  }

  async execute(filters?: { status?: string; search?: string }): Promise<Paciente[]> {
    return this.repository.getAll(filters)
  }
}

export class GetPacienteByIdUseCase {
  private repository: IPacienteRepository
  constructor(repository: IPacienteRepository) {
    this.repository = repository
  }

  async execute(id: number): Promise<Paciente> {
    return this.repository.getById(id)
  }
}

export class CreatePacienteUseCase {
  private repository: IPacienteRepository
  constructor(repository: IPacienteRepository) {
    this.repository = repository
  }

  async execute(data: Partial<Paciente>): Promise<Paciente> {
    return this.repository.create(data)
  }
}

export class UpdatePacienteUseCase {
  private repository: IPacienteRepository
  constructor(repository: IPacienteRepository) {
    this.repository = repository
  }

  async execute(id: number, data: Partial<Paciente>): Promise<Paciente> {
    return this.repository.update(id, data)
  }
}

export class DeletePacienteUseCase {
  private repository: IPacienteRepository
  constructor(repository: IPacienteRepository) {
    this.repository = repository
  }

  async execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
