// Use-cases
import { RegisterProductUseCase } from "@/core/use-cases/register-product";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { makeUser } from "@/test/factories/make-user";
import { makeProduct } from "@/test/factories/make-product";
import { MockedStorage } from "@/test/storage/mocked-storage";

let repositories: {
  users: InMemoryUsersRepository;
  products: InMemoryProductsRepository;
};

let mocks: {
  storage: MockedStorage;
};

let sut: RegisterProductUseCase;

describe("register product", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
      products: new InMemoryProductsRepository(),
    };

    mocks = {
      storage: new MockedStorage(),
    };

    sut = new RegisterProductUseCase(
      repositories.users,
      repositories.products,
      mocks.storage,
    );
  });

  it("should be able to register a new product", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const image = Buffer.from("image");

    await sut.execute({
      user_id: user.id.value,
      name: "Product A",
      image,
      pricing: "UNIT",
    });

    const product = repositories.products.items[0];

    expect(product.name).toEqual("Product A");
    expect(product.image).toContain("temp/products");
    expect(product.pricing).toEqual("UNIT");
    expect(product.archived).toBeFalsy();
  });

  it("should find a product by name and pricing", async () => {
    const product = makeProduct({
      name: "Test Product",
      pricing: "UNIT",
    });
  
    await repositories.products.create(product);
  
    const foundProduct = await repositories.products.find("basic", {
      name: "Test Product",
      pricing: "UNIT",
    });
  
    expect(foundProduct).toBe(product);
  });

  it("should throw an error if the user does not exist", async () => {
    await expect(() =>
      sut.execute({
        user_id: "nonexistent_user",
        name: "Product A",
        image: Buffer.from("image"),
        pricing: "UNIT",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error if the product already exists and is not archived", async () => {
    const user = makeUser();
    await repositories.users.create(user);
  
    const product = makeProduct({
      name: "Existing Product",
      pricing: "UNIT",
      archived: false,
    });
  
    await repositories.products.create(product);
  
    await expect(
      sut.execute({
        user_id: user.id.value,
        name: "Existing Product",
        image: Buffer.from("image"),
        pricing: "UNIT",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });  
  
  it("should unarchive an existing product if it is archived", async () => {
    const user = makeUser();
    await repositories.users.create(user);
  
    const product = makeProduct({
      name: "Archived Product",
      pricing: "UNIT",
      archived: true,
    });
  
    await repositories.products.create(product);
  
    await sut.execute({
      user_id: user.id.value,
      name: "Archived Product",
      image: Buffer.from("image"),
      pricing: "UNIT",
    });
  
    const updatedProduct = await repositories.products.find("basic", {
      name: "Archived Product",
      pricing: "UNIT",
    });
  
    expect(updatedProduct?.archived).toBe(false);
    expect(updatedProduct?.name).toBe("Archived Product");
  });

  it("should upload the product image", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const image = Buffer.from("image");

    await sut.execute({
      user_id: user.id.value,
      name: "Product A",
      image,
      pricing: "UNIT",
    });

    const uploadedImage = repositories.products.items[0].image;

    expect(uploadedImage).toContain("temp/products");
  });
});
