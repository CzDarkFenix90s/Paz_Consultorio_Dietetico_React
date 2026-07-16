// src/domain/ports/photo.repository.ts
import { ProgresoFoto } from '../entities/user.entity'

export interface IPhotoRepository {
  getAll(): Promise<ProgresoFoto[]>
  upload(file: File, description: string): Promise<ProgresoFoto>
}
