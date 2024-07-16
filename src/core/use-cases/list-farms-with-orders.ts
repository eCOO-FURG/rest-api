// Repositories
import { PrismaCyclesRepository } from "@/infra/database/repositories/prisma-cycles-repository";
import { PrismaFarmsRepository } from "@/infra/database/repositories/prisma-farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListFarmsWithOrdersProps {
  cycle_id: string;
  page: number;
  name?: string;
}

export class ListFarmsWithOrdersUsecase {
  constructor(
    private cyclesRepository: PrismaCyclesRepository,
    private farmsRepository: PrismaFarmsRepository
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
