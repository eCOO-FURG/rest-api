// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface FetchCategoryUseCaseRequest {
  id: string;
}

export class FetchCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ id }: FetchCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.find(
      "category-and-offers",
      { id }
    );

    if (!category) throw new ResourceNotFoundError("Categoria", id);

    return { category };
  }
}
