// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Use-cases
import { ListProductsUsecase } from "@/core/use-cases/list-products";

// Services
import { makeCategory } from "@/test/factories/make-category";
import { makeProduct } from "@/test/factories/make-product";

let productsRepository: InMemoryProductsRepository;
let categoriesRepository: InMemoryCategoriesRepository;

let sut: ListProductsUsecase;

describe("list products", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new ListProductsUsecase(productsRepository);
  });

  it("should be able to list products", async () => {
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

  it("should be able to list products by category", async () => {
    const category1 = makeCategory();
    categoriesRepository.create(category1);

    const category2 = makeCategory();
    categoriesRepository.create(category2);

    const product1 = makeProduct({
      name: "Apple",
      category_id: category1.id,
    });
    productsRepository.create(product1);

    const product2 = makeProduct({
      name: "Banana",
      category_id: category2.id,
    });
    productsRepository.create(product2);

    const response = await sut.execute({
      page: 1,
    });

    expect(response.products).toHaveLength(2);
    expect(response.products[0].category_id).toBe(category1.id);
    expect(response.products[1].category_id).toBe(category2.id);
    expect(response.products[0].category_id).not.toBe(
      response.products[1].category_id
    );
  });
});
