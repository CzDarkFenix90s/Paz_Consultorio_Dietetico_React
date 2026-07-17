// src/infrastructure/adapters/axios-plan.repository.ts
import type { IPlanRepository } from '../../domain/ports/plan.repository'
import type { PlanNutricional } from '../../domain/entities/user.entity'
import { axiosClient } from '../http/axios-client'

export class AxiosPlanRepository implements IPlanRepository {
  async getAll(): Promise<PlanNutricional[]> {
    const response = await axiosClient.get('/planes/?page_size=100')
    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      return response.data.results as PlanNutricional[]
    }
    return response.data as PlanNutricional[]
  }

  async getById(id: number): Promise<PlanNutricional> {
    const response = await axiosClient.get(`/planes/${id}/`)
    return response.data as PlanNutricional
  }

  async create(data: Partial<PlanNutricional>): Promise<PlanNutricional> {
    const response = await axiosClient.post('/planes/', data)
    return response.data as PlanNutricional
  }

  async update(id: number, data: Partial<PlanNutricional>): Promise<PlanNutricional> {
    const response = await axiosClient.patch(`/planes/${id}/`, data)
    return response.data as PlanNutricional
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/planes/${id}/`)
  }

  async adquirirPlan(id: number): Promise<any> {
    const response = await axiosClient.post(`/planes/${id}/adquirir/`)
    return response.data
  }
}
