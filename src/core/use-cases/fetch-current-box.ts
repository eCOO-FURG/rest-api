// Repositories
import { BoxesRepository } from "@/core/repositories/boxes-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";

interface FetchCurrentBoxUseCaseRequest {
  farm_id: string;
  cycle_id: string;
  page: number;
}

export class FetchCurrentBoxUseCase {
  constructor(
    private readonly boxesRepository: BoxesRepository,
    private readonly cyclesRepository: CyclesRepository,
    private readonly farmsRepository: FarmsRepository,
  ) {}

  async execute({ farm_id, cycle_id, page }: FetchCurrentBoxUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("cycle", { id: cycle_id });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const farm = await this.farmsRepository.find("farm", { id: farm_id });

    if (!farm) throw new ResourceNotFoundError("Fazenda", farm_id);

    const box = await this.boxesRepository.find("box-and-orders", {
      farm: { id: farm_id },
      cycle: { id: cycle_id },
      orders: { page },
      since: first(cycle.order),
    });

    if (!box) throw new ResourceNotFoundError("Caixa da fazenda", farm_id);

    return { box };
  }
}
