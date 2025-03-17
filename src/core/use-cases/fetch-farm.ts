// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchFarmUseCaseRequest {
  farm_id: string;
}

export class FetchFarmUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({ farm_id }: FetchFarmUseCaseRequest) {
    const farm = await this.farmsRepository.find("aggregate", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    return { farm };
  }
}
