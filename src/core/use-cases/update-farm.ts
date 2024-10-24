// Repositories
import { FarmsRepository } from "../repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";


interface UpdateFarmUseCaseRequest {
  farm_id: string;
  name?: string;
  counterfoil_number?: string;
  description?: string;
}

export class UpdateFarmUseCase {
  constructor(
    private farmsRepository: FarmsRepository
  ) { }

  async execute(props: UpdateFarmUseCaseRequest) {

    const farm = await this.farmsRepository.findById(props.farm_id);

    if (!farm) {
      throw new ResourceNotFoundError("Fazenda", props.farm_id);
    }

    for (const field in props) {
      const value = props[field as keyof UpdateFarmUseCaseRequest];

      if (!value) continue;

      const key = Object.keys(farm.props).find((key) => key === field);

      // @ts-ignore
      farm[key] = value;
      farm.touch();
    }

    await this.farmsRepository.update(farm);
  }
}
