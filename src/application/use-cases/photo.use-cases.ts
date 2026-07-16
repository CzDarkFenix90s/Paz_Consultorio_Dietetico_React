// src/application/use-cases/photo.use-cases.ts
import type { IPhotoRepository } from '../../domain/ports/photo.repository'
import type { ProgresoFoto } from '../../domain/entities/user.entity'

export class GetPhotosUseCase {
  private repository: IPhotoRepository
  constructor(repository: IPhotoRepository) {
    this.repository = repository
  }

  async execute(): Promise<ProgresoFoto[]> {
    return this.repository.getAll()
  }
}

export class UploadPhotoUseCase {
  private repository: IPhotoRepository
  constructor(repository: IPhotoRepository) {
    this.repository = repository
  }

  async execute(file: File, description: string): Promise<ProgresoFoto> {
    return this.repository.upload(file, description)
  }
}
