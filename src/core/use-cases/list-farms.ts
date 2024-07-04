// Repositories
import { FarmsRepository } from "../repositories/farms-repository"

interface ListFarmsUseCaseRequest{
  page: number
  name?: string
}

export class ListFarmsUsecase{
  constructor(private farmsRepository: FarmsRepository){}

  async execute({ page, name }: ListFarmsUseCaseRequest){
    const farms = await this.farmsRepository.searchMany({
      page,
      name
    })

    return {
      farms
    }
  }
} 