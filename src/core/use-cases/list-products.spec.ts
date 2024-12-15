// Repositories
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Use-cases
import { ListProductsUsecase } from "@/core/use-cases/list-products";

// Services
import { makeProduct } from "@/test/factories/make-product";

let productsRepository: InMemoryProductsRepository;

let sut: ListProductsUsecase;

describe("list products", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new ListProductsUsecase(productsRepository);
  });

  it("should be able to list prodcuts", async () => {
    const product1 = makeProduct({
      name: "Apple",
    });
    productsRepository.create(product1);

    const product2 = makeProduct();
    productsRepository.create(product2);

    const response = await sut.execute({
      name: "Apple",
      page: 1,
    });

    expect(response.products).toHaveLength(1);
  });
});
