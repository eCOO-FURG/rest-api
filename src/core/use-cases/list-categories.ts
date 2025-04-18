// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { CategoriesRepository } from "@/core/repositories/categories-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";

interface ListCategoriesUseCaseRequest {
  page: number;
  name?: string;
  cycle_id?: string;
}

export class ListCategoriesUseCase {
  constructor(
    private readonly cyclesRepository: CyclesRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute({ page, name, cycle_id }: ListCategoriesUseCaseRequest) {
    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const categories = await this.categoriesRepository.list(
      "category",
      {
        name,
        ...(cycle && { offers: { cycle_id: cycle.id.value, since: first(cycle.offer) } }),
      },
      page,
    );

    return { categories };
  }
}
