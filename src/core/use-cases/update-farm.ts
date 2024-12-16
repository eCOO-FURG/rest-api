// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateFarmUseCaseRequest {
  farm_id: string;
  name?: string;
  tally?: string;
  description?: string;
  status?: Farm["status"];
}

export class UpdateFarmUseCase {
  constructor(private farmsRepository: FarmsRepository) {}

  async execute({
    farm_id,
    name,
    tally,
    description,
    status,
  }: UpdateFarmUseCaseRequest) {
    const farm = await this.farmsRepository.find("basic", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    farm.tally = tally ?? farm.tally;
    farm.name = name ?? farm.name;
    farm.status = status ?? farm.status;

    if (description) farm.description = description;

    farm.touch();

    await this.farmsRepository.update(farm);
  }
}
