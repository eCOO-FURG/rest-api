// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Farm } from "@/core/entities/farm";

interface HandleFarmStatusUseCaseRequest {
  farm_id: string;
  status: Farm["status"];
}

export class HandleFarmStatusUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({ farm_id, status }: HandleFarmStatusUseCaseRequest) {
    const farm = await this.farmsRepository.search({ id: farm_id }, "entity");

    if (!farm) {
      throw new ResourceNotFoundError("Fazenda", farm_id);
    }

    farm.status = status;

    await this.farmsRepository.update(farm);
  }
}
