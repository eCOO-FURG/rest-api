// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchCategoryUseCaseRequest {
  id: string;
  page: number;
  cycle_id?: string;
  available?: boolean;
  since?: Date;
  before?: Date;
}

export class FetchCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private cyclesRepository: CyclesRepository,
  ) {}

  async execute({ id, page, cycle_id, available, since, before }: FetchCategoryUseCaseRequest) {
    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const category = await this.categoriesRepository.find("category-and-offers", {
      id,
      offers: {
        page,
        available,
        catalog: { cycle: { id: cycle_id } },
        since,
        before,
      },
    });

    if (!category) throw new ResourceNotFoundError("Categoria", id);

    return { category };
  }
}
