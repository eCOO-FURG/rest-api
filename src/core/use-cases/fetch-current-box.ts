// Repositories
import { BoxesRepository } from "@/core/repositories/boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Utils
import { mostPast } from "@/core/utils/most-past";

interface FetchCurrentBoxUseCaseRequest {
  farm_id: string;
  cycle_id: string;
  page: number;
}

export class FetchCurrentBoxUseCase {
  constructor(
    private readonly boxesRepository: BoxesRepository,
    private readonly cyclesRepository: CyclesRepository
  ) {}

  async execute({ farm_id, cycle_id, page }: FetchCurrentBoxUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("basic", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const box = await this.boxesRepository.find("merge", {
      catalog: { farm: { id: farm_id }, cycle: { id: cycle_id } },
      orders: { page },
      since: mostPast(cycle.order),
    });

    if (!box) throw new ResourceNotFoundError("Caixa da fazenda", farm_id);

    return { box };
  }
}
