// src/application/use-cases/plan.use-cases.ts
import type { IPlanRepository } from '../../domain/ports/plan.repository'
import type { PlanNutricional } from '../../domain/entities/user.entity'

export class GetPlanesUseCase {
  private repository: IPlanRepository
  constructor(repository: IPlanRepository) {
    this.repository = repository
  }

  async execute(): Promise<PlanNutricional[]> {
    return this.repository.getAll()
  }
}

export class GetPlanByIdUseCase {
  private repository: IPlanRepository
  constructor(repository: IPlanRepository) {
    this.repository = repository
  }

  async execute(id: number): Promise<PlanNutricional> {
    return this.repository.getById(id)
  }
}

export class CreatePlanUseCase {
  private repository: IPlanRepository
  constructor(repository: IPlanRepository) {
    this.repository = repository
  }

  async execute(data: Partial<PlanNutricional>): Promise<PlanNutricional> {
    return this.repository.create(data)
  }
}

export class UpdatePlanUseCase {
  private repository: IPlanRepository
  constructor(repository: IPlanRepository) {
    this.repository = repository
  }

  async execute(id: number, data: Partial<PlanNutricional>): Promise<PlanNutricional> {
    return this.repository.update(id, data)
  }
}

export class DeletePlanUseCase {
  private repository: IPlanRepository
  constructor(repository: IPlanRepository) {
    this.repository = repository
  }

  async execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
