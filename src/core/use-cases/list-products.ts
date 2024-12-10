// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

interface ListProductsUseCaseRequest {
  page: number;
  name?: string;
}

export class ListProductsUsecase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ page, name }: ListProductsUseCaseRequest) {
    const products = await this.productsRepository.list(
      "basic",
      { name },
      page
    );

    return { products };
  }
}
