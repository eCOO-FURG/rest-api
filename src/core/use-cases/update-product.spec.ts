// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Storage
import { MockedStorage } from "@/test/storage/mocked-storage";

// Factories
import { makeCategory } from "@/test/factories/make-category";
import { makeProduct } from "@/test/factories/make-product";

// Use-Cases
import { UpdateProductUseCase } from "@/core/use-cases/update-product";

// Factories
import { makeFile } from "@/test/factories/make-file";

let productsRepository: InMemoryProductsRepository;
let categoriesRepository: InMemoryCategoriesRepository;
let storage: MockedStorage;
let sut: UpdateProductUseCase;

describe("Update Product UseCase", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    storage = new MockedStorage();

    sut = new UpdateProductUseCase(
      productsRepository,
      categoriesRepository,
      storage,
    );
  });

  it("should update a product successfully", async () => {
    const product = makeProduct();
    const category = makeCategory();

    await categoriesRepository.create(category);
    await productsRepository.create(product);

    await sut.execute({
      product_id: product.id.value,
      name: "Produto show",
      image: makeFile(),
      pricing: "UNIT",
      category_id: category.id.value,
      archived: false,
      perishable: true,
    });

    expect(product).toBeDefined();
    expect(product.name).toBe("Produto show");
    expect(product.pricing).toBe("UNIT");
    expect(product.category_id.value).toBe(category.id.value);
    expect(product.archived).toBe(false);
    expect(product.image).toContain("products");
    expect(product.perishable).toBe(true);
  });

  it("should throw an error if the product does not exist", async () => {
    await expect(
      sut.execute({
        product_id: "123",
        name: "Produto do Timas",
        image: makeFile(),
        pricing: "UNIT",
        archived: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error if a product with the same name and pricing already exists", async () => {
    const product1 = makeProduct({ name: "Produto 9", pricing: "UNIT" });
    await productsRepository.create(product1);

    const product2 = makeProduct();
    await productsRepository.create(product2);

    await expect(
      sut.execute({
        product_id: product2.id.value,
        name: "Produto 9",
        image: makeFile(),
        pricing: "UNIT",
        archived: false,
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should update only specific fields of a product", async () => {
    const product = makeProduct({
      name: "Produto legal",
      pricing: "UNIT",
      archived: true,
    });

    await productsRepository.create(product);

    await sut.execute({
      product_id: product.id.value,
      name: "Novo nome teste",
    });

    expect(product).toBeDefined();
    expect(product.name).toBe("Novo nome teste");
    expect(product.pricing).toBe("UNIT");
    expect(product.image).toBe(product.image);
    expect(product.archived).toBe(true);
  });
});
