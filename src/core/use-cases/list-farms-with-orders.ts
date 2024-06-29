import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found";
import { UUID } from "crypto";

interface ListFarmsWithOrdersProps{
  cycle_id: UUID;
  page: number
  name: string
}

export class ListFarmsWithOrdersUsecase{
  constructor(
    private cyclesRepository: InMemoryCyclesRepository,
    private farmsRepository: InMemoryFarmsRepository
  ){}

  async execute({ cycle_id, page, name }: ListFarmsWithOrdersProps){
    const cycle = await this.cyclesRepository.findById(cycle_id)

    if(!cycle) throw new ResourceNotFoundError('Ciclo', cycle_id)

    const farms = await this.farmsRepository.searchManyWithOrders({ cycle_id, page, name })

    return {
      farms
    }
  }
}