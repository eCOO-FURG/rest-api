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
  ) {}

  async execute({
    farm_id,
    cycle_id,
    product,
    page,
  }: ListFarmsOffersUseCaseRequest) {
    const farm = await this.farmsRepository.search(
      { id: farm_id },
      "aggregate"
    );

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const offers = await this.offersRepository.searchMany(
      {
        farm_id,
        cycle_id,
        page,
        since: mostPast(cycle.offer),
        ...(product && { product: { name: product } }),
      },
      "aggregate"
    );

    return {
      farm,
      offers,
    };
  }
}
