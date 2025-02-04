// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { makeCategory } from "@/test/factories/make-category";
import { MockedStorage } from "@/test/storage/mocked-storage";

// Factories
import { makeProduct } from "@/test/factories/make-product";
import { makeFile } from "@/test/factories/make-file";

let productsRepository: InMemoryProductsRepository;
let categoriesRepository: InMemoryCategoriesRepository;

let storage: MockedStorage;

let sut: RegisterProductUseCase;

describe("register product", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    storage = new MockedStorage();

    sut = new RegisterProductUseCase(
      productsRepository,
      categoriesRepository,
      storage
    );
  });

  it("should be able to register a new product", async () => {
    const category = makeCategory();

    await sut.execute({
      name: "Produto show",
      image: makeFile(),
      pricing: "UNIT",
      category_id: category.id.value,
    });

    const product = productsRepository.items[0];

    expect(product.name).toEqual("Produto show");
    expect(product.pricing).toEqual("UNIT");
    expect(product.archived).toBeFalsy();
    expect(product.category).toBe(category);
  });

  it("should find a product by name and pricing", async () => {
    const product = makeProduct({
      name: "Teste produto",
      pricing: "UNIT",
    });

    await productsRepository.create(product);

    const foundProduct = await productsRepository.find("basic", {
      name: "Teste produto",
      pricing: "UNIT",
    });

    expect(foundProduct).toBe(product);
  });

  it("should throw an error if the product already exists and is not archived", async () => {
    const product = makeProduct({
      name: "Produto novo",
      pricing: "UNIT",
      archived: false,
    });

    await productsRepository.create(product);

    await expect(
      sut.execute({
        name: "Produto novo",
        image: makeFile(),
        pricing: "UNIT",
        category_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should unarchive an existing product if it is archived", async () => {
    const product = makeProduct({
      name: "Produto arquivado",
      pricing: "UNIT",
      archived: true,
    });

    await productsRepository.create(product);

    await sut.execute({
      name: "Produto arquivado",
      image: makeFile(),
      pricing: "UNIT",
      category_id: "123",
    });

    const updatedProduct = await productsRepository.find("basic", {
      name: "Produto arquivado",
      pricing: "UNIT",
    });

    expect(updatedProduct?.archived).toBe(false);
    expect(updatedProduct?.name).toBe("Produto arquivado");
  });

  it("should upload the product image", async () => {
    await sut.execute({
      name: "Produto",
      image: makeFile(),
      pricing: "UNIT",
      category_id: "123",
    });

    expect(productsRepository.items[0].image).toContain("temp/products");
  });
});
