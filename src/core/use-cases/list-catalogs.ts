// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { FarmsRepository } from "@/core/repositories/farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListCatalogsUseCaseRequest {
  page: number;
  cycle_id?: string;
  farm_id?: string;
  category_id?: string;
  product?: string;
  available?: boolean;
  remaining?: boolean;
  since?: Date;
  before?: Date;
}

export class ListCatalogsUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private farmsRepository: FarmsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    cycle_id,
    page,
    product,
    category_id,
    farm_id,
    available,
    remaining,
    since,
    before,
  }: ListCatalogsUseCaseRequest) {
    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const farm = farm_id ? await this.farmsRepository.find("farm", { id: farm_id }) : null;

    if (farm_id && !farm) {
      throw new ResourceNotFoundError("Fazenda", farm_id);
    }

    const category = category_id
      ? await this.categoriesRepository.find("category", { id: category_id })
      : null;

    if (category_id && !category) {
      throw new ResourceNotFoundError("Categoria", category_id);
    }

    const catalogs = await this.farmsRepository.list(
      "catalog",
      {
        id: farm_id,
        offers: {
          cycle: { id: cycle_id },
          product: { name: product, category: { id: category_id } },
          available,
          remaining,
          page,
          since,
          before,
        },
      },
      page,
    );

    return { catalogs };
  }
}
