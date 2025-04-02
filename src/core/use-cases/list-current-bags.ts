// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";

// Entities
import { BagStatus } from "@/core/entities/bag";

interface ListCurrentBagsUseCaseRequest {
  cycle_id: string;
  page: number;
  statuses?: BagStatus[];
  user?: string;
}

export class ListCurrentBagsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private bagsRepository: BagsRepository
  ) {}

  async execute({
    cycle_id,
    statuses,
    user,
    page,
  }: ListCurrentBagsUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("cycle", {
      id: cycle_id,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const bags = await this.bagsRepository.list(
      "bag-and-details",
      {
        user: { name: user },
        statuses,
        cycle: { id: cycle_id },
        since: first(cycle.order),
      },
      page
    );

    return { bags };
  }
}
