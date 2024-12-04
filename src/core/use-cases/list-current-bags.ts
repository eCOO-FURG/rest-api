// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

// Entities
import { Bag } from "@/core/entities/bag";

interface ListCurrentBagsUseCaseRequest {
  cycle_id: string;
  page: number;
  statuses?: Bag["status"][];
  name?: string;
}

export class ListCurrentBagsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private bagsRepository: BagsRepository
  ) {}

  async execute({
    cycle_id,
    statuses,
    name,
    page,
  }: ListCurrentBagsUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("basic", {
      id: cycle_id,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const bags = await this.bagsRepository.list(
      "aggregate",
      {
        user: { name },
        statuses,
        cycle: { id: cycle_id },
        since: mostPast(cycle.order),
      },
      page
    );

    return { bags };
  }
}
