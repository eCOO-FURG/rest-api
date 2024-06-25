// Repositories
import { FarmsRepository } from "../repositories/farms-repository"

interface ListFarmsRequest{
  page: number
  query?: string
}

export class ListFarmsUsecase{
  constructor(private farmsRepository: FarmsRepository){}

  async execute({ page, query }: ListFarmsRequest){
    const farms = await this.farmsRepository.searchManyFarms(page, query)

    return {
      farms
    }
  }
} 