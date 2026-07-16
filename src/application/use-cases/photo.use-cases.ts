// src/application/use-cases/photo.use-cases.ts
import type { IPhotoRepository } from '../../domain/ports/photo.repository'
import type { ProgresoFoto } from '../../domain/entities/user.entity'

export class GetPhotosUseCase {
  constructor(private repository: IPhotoRepository) {}

  async execute(): Promise<ProgresoFoto[]> {
    return this.repository.getAll()
  }
}

export class UploadPhotoUseCase {
  constructor(private repository: IPhotoRepository) {}

  async execute(file: File, description: string): Promise<ProgresoFoto> {
    return this.repository.upload(file, description)
  }
}
