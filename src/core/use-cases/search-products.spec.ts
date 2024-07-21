// Repositories
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository"

// Use-cases
import { SearchProductsUseCase } from "./search-products"

// Services
import { makeProduct } from "@/test/factories/make-product";

let sut: SearchProductsUseCase

let repositories: {
  products: InMemoryProductsRepository;
}

describe('search products', () => {
  beforeEach(() => {
    repositories = {
      products: new InMemoryProductsRepository()
    }

    sut = new SearchProductsUseCase(repositories.products)
  })

  it('should be able search products with paginated', async () => {
    for(let i = 1; i <= 22; i++){
      const product = makeProduct({
        name: `Produto ${i}`
      })

      await repositories.products.create(product)
    }

    const { products } = await sut.execute({
      page: 2,
    })

    expect(products).toHaveLength(2)
  })

  it('should be able search product', async () => {
    for(let i = 1; i <= 10; i++){
      const product = makeProduct({
        name: `Produto ${i}`
      })

      await repositories.products.create(product)
    }

    const { products } = await sut.execute({
      page: 1,
      name: 'Produto 4'
    })

    expect(products).toHaveLength(1)
    expect(products).toEqual([expect.objectContaining({ name: "Produto 4" })]);
  })
})