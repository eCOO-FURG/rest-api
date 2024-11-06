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
    const farm = await this.farmsRepository.search(
      {
        id: farm_id,
      },
      "aggregate"
    );

    if (!farm) throw new ResourceNotFoundError("Fazenda do", farm_id);

    return { farm };
  }
}
