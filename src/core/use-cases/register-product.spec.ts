// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Repositories
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { MockedStorage } from "@/test/storage/mocked-storage";

// Factories
import { makeProduct } from "@/test/factories/make-product";
import { makeFile } from "@/test/factories/make-file";

let productsRepository: InMemoryProductsRepository;

let storage: MockedStorage;

let sut: RegisterProductUseCase;

describe("register product", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    storage = new MockedStorage();

    sut = new RegisterProductUseCase(productsRepository, storage);
  });

  it("should be able to register a new product", async () => {
    await sut.execute({
      name: "Produto show",
      image: makeFile(),
      pricing: "UNIT",
    });

    const product = productsRepository.items[0];

    expect(product.name).toEqual("Produto show");
    expect(product.pricing).toEqual("UNIT");
    expect(product.archived).toBeFalsy();
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
    });

    expect(productsRepository.items[0].image).toContain("temp/products");
  });
});
