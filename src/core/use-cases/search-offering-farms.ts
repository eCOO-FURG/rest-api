// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface SearchOfferingFarmsUseCaseRequest {
  cycle_id: string;
  page: number;
  product?: string;
}

export class SearchOfferingFarmsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository
  ) {}

  async execute({
    cycle_id,
    page,
    product,
  }: SearchOfferingFarmsUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farms = await this.farmsRepository.findManyWithActiveOffer({
      cycle_id: cycle.id.value,
      page,
      product,
      created_at: mostPast(cycle.offer),
    });

    return {
      farms,
    };
  }
}
