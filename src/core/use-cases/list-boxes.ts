// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { BoxesRepository } from "@/core/repositories/boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListFarmsWithOrdersProps {
  cycle_id: string;
  page: number;
  name?: string;
}

export class ListBoxesUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private boxesRepository: BoxesRepository
  ) {}

  async execute({ cycle_id, page, name }: ListFarmsWithOrdersProps) {
    const cycle = await this.cyclesRepository.find("basic", {
      id: cycle_id,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const boxes = await this.boxesRepository.list(
      "aggregate",
      {
        catalog: {
          cycle: { id: cycle_id },
          farm: { name },
        },
      },
      page
    );

    return { boxes };
  }
}
