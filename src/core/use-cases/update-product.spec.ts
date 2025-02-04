// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Services
import { MockedStorage } from "@/test/storage/mocked-storage";

// Factories
import { makeCategory } from "@/test/factories/make-category";
import { makeProduct } from "@/test/factories/make-product";

// Use-Cases
import { UpdateProductUseCase } from "@/core/use-cases/update-product";

// Utils
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
      storage
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
    });

    const updatedProduct = await productsRepository.find("basic", {
      id: product.id.value,
    });

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.name).toBe("Produto show");
    expect(updatedProduct?.pricing).toBe("UNIT");
    expect(updatedProduct?.category_id).toBe(category.id);
    expect(updatedProduct?.archived).toBe(false);
    expect(updatedProduct?.image).toContain("products");
  });

  it("should throw an error if the product does not exist", async () => {
    await expect(
      sut.execute({
        product_id: "123",
        name: "Produto do Timas",
        image: makeFile(),
        pricing: "UNIT",
        archived: false,
      })
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
      })
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
      archived: false,
    });

    const updatedProduct = await productsRepository.find("basic", {
      id: product.id.value,
    });

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.name).toBe("Novo nome teste");
    expect(updatedProduct?.pricing).toBe("UNIT");
    expect(updatedProduct?.archived).toBe(false);
    expect(updatedProduct?.image).toBe(product.image);
  });
});
