// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

interface ListProductsUseCaseRequest {
  page: number;
  name?: string;
  category_id?: string;
  archived?: boolean;
}

export class ListProductsUsecase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ page, name, category_id, archived }: ListProductsUseCaseRequest) {
    const products = await this.productsRepository.list(
      "product-and-category",
      { name, archived, category: { id: category_id } },
      page,
    );

    return { products };
  }
}
