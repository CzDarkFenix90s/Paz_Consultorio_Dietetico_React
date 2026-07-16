// src/infrastructure/factories/photo.factory.ts
import { AxiosPhotoRepository } from '../adapters/axios-photo.repository'
import {
  GetPhotosUseCase,
  UploadPhotoUseCase,
} from '../../application/use-cases/photo.use-cases'

const repository = new AxiosPhotoRepository()

export const getPhotosUseCase = new GetPhotosUseCase(repository)
export const uploadPhotoUseCase = new UploadPhotoUseCase(repository)
export { repository as photoRepository }
