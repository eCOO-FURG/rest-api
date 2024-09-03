// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { mostPast } from "@/core/utils/most-past";

interface ListBagsUseCaseRequest {
  cycle_id: string;
  page: number;
  status?: "PENDING" | "SEPARATED" | "DISPATCHED";
  name?: string;
}

export class ListBagsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private bagsRepository: BagsRepository
  ) {}

  async execute({ cycle_id, ...props }: ListBagsUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const bags = await this.bagsRepository.searchMany(
      {
        ...props,
        cycle: {
          id: cycle_id,
        },
        since: mostPast(cycle.order),
      },
      "aggregate"
    );

    return {
      bags,
    };
  }
}
