// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface ListFarmsOffersUseCaseRequest {
  farm_id: string;
  cycle_id: string;
  page: number;
  product?: string;
}

export class ListFarmOffersUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private cyclesRepository: CyclesRepository,
    private offersRepository: OffersRepository
  ) { }

  async execute({
    farm_id,
    cycle_id,
    product,
    page,
  }: ListFarmsOffersUseCaseRequest) {
    const farm = await this.farmsRepository.findById(farm_id);

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const offers = await this.offersRepository.searchMany({
      farm_id,
      cycle_id,
      product,
      page,
      created_at: mostPast(cycle.offer),
    });

    return {
      farm,
      offers
    };
  }
}
