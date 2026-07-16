// src/domain/ports/plan.repository.ts
import type { PlanNutricional } from '../entities/user.entity'

export interface IPlanRepository {
  getAll(): Promise<PlanNutricional[]>
  getById(id: number): Promise<PlanNutricional>
  create(data: Partial<PlanNutricional>): Promise<PlanNutricional>
  update(id: number, data: Partial<PlanNutricional>): Promise<PlanNutricional>
  delete(id: number): Promise<void>
}
