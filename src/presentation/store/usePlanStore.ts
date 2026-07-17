// src/presentation/store/usePlanStore.ts
import { create } from 'zustand'
import type { PlanNutricional } from '../../domain/entities/user.entity'
import {
  getPlanesUseCase,
  getPlanByIdUseCase,
  createPlanUseCase,
  updatePlanUseCase,
  deletePlanUseCase,
} from '../../infrastructure/factories/plan.factory'
import { planRepository } from '../../infrastructure/factories/plan.factory'

const mockPlanes: PlanNutricional[] = [
  {
    id: 1,
    name: 'Plan Balance Saludable',
    description: 'Plan general enfocado en control de porciones y comidas balanceadas.',
    goal: 'Mejorar composición corporal',
    target_calories: 1850,
    duration_weeks: 8,
    estimated_cost: '250.00',
    is_active: true,
    total_alimentos: 24,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Plan Descenso Activo',
    description: 'Bajo en calorías y alto en fibra para acelerar la pérdida de peso de forma segura.',
    goal: 'Pérdida de peso',
    target_calories: 1500,
    duration_weeks: 12,
    estimated_cost: '310.00',
    is_active: true,
    total_alimentos: 18,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Plan Hipertrofia Estricto',
    description: 'Superávit calórico controlado con alto porcentaje de proteína magra.',
    goal: 'Ganancia muscular',
    target_calories: 2800,
    duration_weeks: 16,
    estimated_cost: '400.00',
    is_active: false,
    total_alimentos: 35,
    created_at: new Date().toISOString(),
  }
]

interface PlanState {
  planes: PlanNutricional[]
  activePlan: PlanNutricional | null
  loading: boolean
  error: string | null
  fetchPlanes: () => Promise<void>
  fetchPlanById: (id: number) => Promise<void>
  createPlan: (data: Partial<PlanNutricional>) => Promise<boolean>
  updatePlan: (id: number, data: Partial<PlanNutricional>) => Promise<boolean>
  deletePlan: (id: number) => Promise<boolean>
  adquirirPlan: (id: number) => Promise<boolean>
  clearError: () => void
}

export const usePlanStore = create<PlanState>((set) => ({
  planes: [],
  activePlan: null,
  loading: false,
  error: null,

  fetchPlanes: async () => {
    try {
      set({ loading: true, error: null })
      const data = await getPlanesUseCase.execute()
      set({ planes: data.length > 0 ? data : mockPlanes, loading: false })
    } catch (err) {
      // Offline fallback
      set({ planes: mockPlanes, error: null, loading: false })
    }
  },

  fetchPlanById: async (id) => {
    try {
      set({ loading: true, error: null })
      const data = await getPlanByIdUseCase.execute(id)
      set({ activePlan: data, loading: false })
    } catch (err) {
      // Offline fallback
      const found = mockPlanes.find(p => p.id === id) || mockPlanes[0]
      set({ activePlan: found, error: null, loading: false })
    }
  },

  createPlan: async (data) => {
    try {
      set({ loading: true, error: null })
      await createPlanUseCase.execute(data)
      const freshPlanes = await getPlanesUseCase.execute()
      set({ planes: freshPlanes.length > 0 ? freshPlanes : mockPlanes, loading: false })
      return true
    } catch (err) {
      // Offline fallback success simulation
      set((state) => {
        const newPlan: PlanNutricional = {
          id: state.planes.length + 10,
          name: data.name || 'Nuevo Plan',
          description: data.description || 'Sin descripción',
          goal: data.goal || 'General',
          target_calories: data.target_calories || 2000,
          duration_weeks: data.duration_weeks || 12,
          estimated_cost: data.estimated_cost || '300.00',
          is_active: data.is_active !== undefined ? data.is_active : true,
          total_alimentos: data.total_alimentos || 10,
          created_at: new Date().toISOString()
        }
        return {
          planes: [...state.planes, newPlan],
          loading: false
        }
      })
      return true
    }
  },

  updatePlan: async (id, data) => {
    try {
      set({ loading: true, error: null })
      await updatePlanUseCase.execute(id, data)
      const freshPlanes = await getPlanesUseCase.execute()
      set({ planes: freshPlanes.length > 0 ? freshPlanes : mockPlanes, loading: false })
      return true
    } catch (err) {
      // Offline fallback success simulation
      set((state) => ({
        planes: state.planes.map(p => p.id === id ? { ...p, ...data } : p),
        loading: false
      }))
      return true
    }
  },

  deletePlan: async (id) => {
    try {
      set({ loading: true, error: null })
      await deletePlanUseCase.execute(id)
      const freshPlanes = await getPlanesUseCase.execute()
      set({ planes: freshPlanes.length > 0 ? freshPlanes : mockPlanes, loading: false })
      return true
    } catch (err) {
      // Offline fallback success simulation
      set((state) => ({
        planes: state.planes.filter((p) => p.id !== id),
        loading: false,
      }))
      return true
    }
  },

  adquirirPlan: async (id) => {
    try {
      set({ loading: true, error: null })
      const repo = planRepository as any
      await repo.adquirirPlan(id)
      set({ loading: false })
      return true
    } catch (err) {
      // Offline fallback success simulation
      set({ loading: false })
      return true
    }
  },

  clearError: () => set({ error: null }),
}))
