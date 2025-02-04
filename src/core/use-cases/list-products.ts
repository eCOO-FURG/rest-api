// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

interface ListProductsUseCaseRequest {
  page: number;
  name?: string;
  category_id?: string;
}

export class ListProductsUsecase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ page, name, category_id }: ListProductsUseCaseRequest) {
    const products = await this.productsRepository.list(
      "basic",
      { name, archived: false, category: { id: category_id } },
      page
    );

    return { products };
  }
}
