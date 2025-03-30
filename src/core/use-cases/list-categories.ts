// Repositories
import { CategoriesRepository } from "@/core/repositories/categories-repository";

interface ListCategoriesUseCaseRequest {
  page: number;
  name?: string;
}

export class ListCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ page, name }: ListCategoriesUseCaseRequest) {
    const categories = await this.categoriesRepository.list(
      "category",
      {
        name,
      },
      page
    );

    return { categories };
  }
}
