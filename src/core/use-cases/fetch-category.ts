// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";

interface FetchCategoryUseCaseRequest {
  id: string;
  page: number;
  cycle_id?: string;
}

export class FetchCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private cyclesRepository: CyclesRepository,
  ) {}

  async execute({ id, page, cycle_id }: FetchCategoryUseCaseRequest) {
    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const category = await this.categoriesRepository.find("category-and-offers", {
      id,
      offers: {
        page,
        cycle_id,
        ...(cycle && { since: first(cycle.offer) }),
      },
    });

    if (!category) throw new ResourceNotFoundError("Categoria", id);

    return { category };
  }
}
