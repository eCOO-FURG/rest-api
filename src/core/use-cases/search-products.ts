// Repositories 
import { ProductsRepository } from "../repositories/products-repository"

interface SearchProductsUseCaseRequest {
  page: number  
  name?: string
}

export class SearchProductsUseCase{
  constructor(
    private productsRepository: ProductsRepository
  ){}

  async execute({ page, name }: SearchProductsUseCaseRequest){
    const products = await this.productsRepository.searchMany({
      page,
      name
    })

    return {
      products
    }
  }
}