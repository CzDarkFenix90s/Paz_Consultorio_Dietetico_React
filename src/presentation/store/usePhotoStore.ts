// src/presentation/store/usePhotoStore.ts
import { create } from 'zustand'
import type { ProgresoFoto } from '../../domain/entities/user.entity'
import {
  getPhotosUseCase,
  uploadPhotoUseCase,
} from '../../infrastructure/factories/photo.factory'
import { parseApiError } from '../../infrastructure/http/parse-api-error'

interface PhotoState {
  photos: ProgresoFoto[]
  loading: boolean
  error: string | null
  fetchPhotos: () => Promise<void>
  uploadPhoto: (file: File, description: string) => Promise<boolean>
  clearError: () => void
}

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],
  loading: false,
  error: null,

  fetchPhotos: async () => {
    try {
      set({ loading: true, error: null })
      const data = await getPhotosUseCase.execute()
      set({ photos: data, loading: false })
    } catch (err) {
      set({ error: parseApiError(err), loading: false })
    }
  },

  uploadPhoto: async (file, description) => {
    try {
      set({ loading: true, error: null })
      const newPhoto = await uploadPhotoUseCase.execute(file, description)
      set((state) => ({
        photos: [newPhoto, ...state.photos],
        loading: false,
      }))
      return true
    } catch (err) {
      set({ error: parseApiError(err), loading: false })
      return false
    }
  },

  clearError: () => set({ error: null }),
}))
