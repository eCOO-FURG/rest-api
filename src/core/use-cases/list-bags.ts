// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { BagsRepository } from "@/core/repositories/bags-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListBagsUseCaseRequest {
  cycle_id: string;
  page: number;
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
      { ...props, cycle_id },
      "aggregate"
    );

    return {
      bags,
    };
  }
}
