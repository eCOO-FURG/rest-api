// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListFarmsWithOrdersProps {
  cycle_id: string;
  page: number;
  name?: string;
}

export class ListFarmsWithOrdersUsecase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository
  ) {}

  async execute({ cycle_id, page, name }: ListFarmsWithOrdersProps) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farms = await this.farmsRepository.searchManyWithOrders({
      cycle_id,
      page,
      name,
    });

    return {
      farms,
    };
  }
}
