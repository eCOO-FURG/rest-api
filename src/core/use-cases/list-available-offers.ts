// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";
import { CyclesRepository } from "@/core/repositories/cycles-repository";
import { OffersRepository } from "@/core/repositories/offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface ListAvailableOffersUseCaseRequest {
  page: number;
  cycle_id?: string;
  product?: string;
  category_id?: string;
}

export class ListAvailableOffersUseCase {
  constructor(
    private offersRepository: OffersRepository,
    private cyclesRepository: CyclesRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({ cycle_id, page, product, category_id }: ListAvailableOffersUseCaseRequest) {
    const cycle = cycle_id ? await this.cyclesRepository.find("cycle", { id: cycle_id }) : null;

    if (cycle_id && !cycle) throw new ResourceNotFoundError("Ciclo", cycle_id);

    const category = category_id ? await this.categoriesRepository.find("category", { id: category_id }) : null;

    console.log("category", category);

    if (category_id && !category) throw new ResourceNotFoundError("Categoria", category_id);

    const offers = await this.offersRepository.list(
      "offer-and-details",
      {
        product: { name: product, category: { id: category_id } },
        catalog: {
          cycle: { id: cycle_id },
        },
        active: true,
        available: true,
      },
      page,
    );

    return { offers };
  }
}
