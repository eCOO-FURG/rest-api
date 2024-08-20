// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface HandleFarmStatusUseCaseRequest {
  farm_id: string;
}

export class HandleFarmStatusUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({ farm_id }: HandleFarmStatusUseCaseRequest) {
    const farm = await this.farmsRepository.search({ id: farm_id }, "entity");
    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    farm.active = !farm.active;

    await this.farmsRepository.update(farm);
  }
}
