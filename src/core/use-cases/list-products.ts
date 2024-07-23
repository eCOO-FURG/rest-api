// Repositories
import { ProductsRepository } from "@/core/repositories/products-repository";

interface ListProductsUseCaseRequest {
  page: number;
  product?: string;
}

export class ListProductsUsecase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ page, product }: ListProductsUseCaseRequest) {
    const products = await this.productsRepository.findMany(page, product);

    return {
      products,
    };
  }
}
