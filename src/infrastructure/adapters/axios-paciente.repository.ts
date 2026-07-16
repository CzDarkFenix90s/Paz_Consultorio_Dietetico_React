// src/infrastructure/adapters/axios-paciente.repository.ts
import type { IPacienteRepository } from '../../domain/ports/paciente.repository'
import type { Paciente } from '../../domain/entities/user.entity'
import { axiosClient } from '../http/axios-client'

export class AxiosPacienteRepository implements IPacienteRepository {
  async getAll(filters?: { status?: string; search?: string }): Promise<Paciente[]> {
    const response = await axiosClient.get('/pacientes/', {
      params: filters,
    })
    // Support paginated results from Django REST Framework StandardPagination
    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      return response.data.results as Paciente[]
    }
    return response.data as Paciente[]
  }

  async getById(id: number): Promise<Paciente> {
    const response = await axiosClient.get(`/pacientes/${id}/`)
    return response.data as Paciente
  }

  async create(data: Partial<Paciente>): Promise<Paciente> {
    const response = await axiosClient.post('/pacientes/', data)
    return response.data as Paciente
  }

  async update(id: number, data: Partial<Paciente>): Promise<Paciente> {
    const response = await axiosClient.patch(`/pacientes/${id}/`, data)
    return response.data as Paciente
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/pacientes/${id}/`)
  }
}
