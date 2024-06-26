// Repositories
import { FarmsRepository } from "../repositories/farms-repository"

interface ListFarmsRequest{
  page: number
  name?: string
}

export class ListFarmsUsecase{
  constructor(private farmsRepository: FarmsRepository){}

  async execute({ page, name }: ListFarmsRequest){
    const farms = await this.farmsRepository.searchMany({
      page,
      name
    })

    return {
      farms
    }
  }
} 