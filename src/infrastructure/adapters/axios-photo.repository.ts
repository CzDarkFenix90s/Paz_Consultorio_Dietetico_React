// src/infrastructure/adapters/axios-photo.repository.ts
import type { IPhotoRepository } from '../../domain/ports/photo.repository'
import type { ProgresoFoto } from '../../domain/entities/user.entity'
import { axiosClient } from '../http/axios-client'

export class AxiosPhotoRepository implements IPhotoRepository {
  async getAll(): Promise<ProgresoFoto[]> {
    const response = await axiosClient.get('/progresos-fotos/')
    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      return response.data.results as ProgresoFoto[]
    }
    return response.data as ProgresoFoto[]
  }

  async upload(file: File, description: string): Promise<ProgresoFoto> {
    const formData = new FormData()
    formData.append('foto', file)
    formData.append('descripcion', description)
    const response = await axiosClient.post('/progresos-fotos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data as ProgresoFoto
  }
}
