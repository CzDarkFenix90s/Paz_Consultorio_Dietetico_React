// src/application/use-cases/plan.use-cases.ts
import type { IPlanRepository } from '../../domain/ports/plan.repository'
import type { PlanNutricional } from '../../domain/entities/user.entity'

export class GetPlanesUseCase {
  constructor(private repository: IPlanRepository) {}

  async execute(): Promise<PlanNutricional[]> {
    return this.repository.getAll()
  }
}

export class GetPlanByIdUseCase {
  constructor(private repository: IPlanRepository) {}

  async execute(id: number): Promise<PlanNutricional> {
    return this.repository.getById(id)
  }
}

export class CreatePlanUseCase {
  constructor(private repository: IPlanRepository) {}

  async execute(data: Partial<PlanNutricional>): Promise<PlanNutricional> {
    return this.repository.create(data)
  }
}

export class UpdatePlanUseCase {
  constructor(private repository: IPlanRepository) {}

  async execute(id: number, data: Partial<PlanNutricional>): Promise<PlanNutricional> {
    return this.repository.update(id, data)
  }
}

export class DeletePlanUseCase {
  constructor(private repository: IPlanRepository) {}

  async execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
