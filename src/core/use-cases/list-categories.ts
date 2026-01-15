// Entities
import { BagSource } from "@/core/entities/bag";

// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListCategoriesUseCaseRequest {
  page: number;
  name?: string;
  cycle_id?: string;
  available?: BagSource | false;
  since?: Date;
  before?: Date;
}

export class ListCategoriesUseCase {
  constructor(
    private readonly cyclesRepository: CyclesRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute({ page, name, cycle_id, available, since, before }: ListCategoriesUseCaseRequest) {
    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const categories = await this.categoriesRepository.list(
      "category",
      {
        name,
        offers: {
          available,
          catalog: { cycle: { id: cycle_id } },
        },
        since,
        before,
      },
      page,
    );

    return { categories };
  }
}
