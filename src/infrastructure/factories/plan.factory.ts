// src/infrastructure/factories/plan.factory.ts
import { AxiosPlanRepository } from '../adapters/axios-plan.repository'
import {
  GetPlanesUseCase,
  GetPlanByIdUseCase,
  CreatePlanUseCase,
  UpdatePlanUseCase,
  DeletePlanUseCase,
} from '../../application/use-cases/plan.use-cases'

const repository = new AxiosPlanRepository()

export const getPlanesUseCase = new GetPlanesUseCase(repository)
export const getPlanByIdUseCase = new GetPlanByIdUseCase(repository)
export const createPlanUseCase = new CreatePlanUseCase(repository)
export const updatePlanUseCase = new UpdatePlanUseCase(repository)
export const deletePlanUseCase = new DeletePlanUseCase(repository)
export { repository as planRepository }
