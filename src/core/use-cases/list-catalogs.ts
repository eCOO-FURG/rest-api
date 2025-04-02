// Repositories
import { CatalogsRepository } from "@/core/repositories/catalogs-repository";
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { first } from "@/core/utils/first";

interface ListCatalogsUseCaseRequest {
  cycle_id: string;
  page: number;
  product?: string;
  category_id?: string;
}

export class ListCatalogsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private catalogsRepository: CatalogsRepository,
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute({
    cycle_id,
    page,
    product,
    category_id,
  }: ListCatalogsUseCaseRequest) {
    const cycle = await this.cyclesRepository.find("cycle", {
      id: cycle_id,
    });

    if (!cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const category = category_id
      ? await this.categoriesRepository.find("category", { id: category_id })
      : null;

    if (category_id && !category)
      throw new ResourceNotFoundError("Categoria", category_id);

    const catalogs = await this.catalogsRepository.list(
      "catalog-and-farm",
      {
        cycle: { id: cycle_id },
        since: first(cycle.offer),
        offers: {
          product: {
            name: product,
            category: { id: category_id },
          },
          expired: false,
          page,
        },
      },
      page
    );

    return { catalogs };
  }
}
