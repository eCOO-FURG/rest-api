// Use-cases
import { RegisterFarmImageUseCase } from "@/core/use-cases/register-farm-image";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeUser } from "@/test/factories/make-user";
import { MockedStorage } from "@/test/storage/mocked-storage";

// Repositories
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceReachedLimitError } from "@/core/errors/resource-reached-limit";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

// Utils

// Types
import { File } from "@/core/types/file";

let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let usersRepository: InMemoryUsersRepository;

let storage: MockedStorage;

let sut: RegisterFarmImageUseCase;

describe("register farm image", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    farmsRepository = new InMemoryFarmsRepository();
    catalogsRepository = new InMemoryCatalogsRepository();
    usersRepository = new InMemoryUsersRepository();
    storage = new MockedStorage();

    sut = new RegisterFarmImageUseCase(
      farmsRepository,
      usersRepository,
      storage
    );
  });

  it("should be able to register a farm image", async () => {
    const user = makeUser();
    user.verify();
    usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id, status: "ACTIVE" });
    farmsRepository.create(farm);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      image: mockedImage,
    });

    expect(farm.images.size).toBe(1);
  });
  it("should not be able to register an image in a nonexistent farm", async () => {
    const user = makeUser();
    user.verify();
    usersRepository.create(user);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    await expect(
      sut.execute({
        user_id: user.id.value,
        farm_id: new UUID().value,
        image: mockedImage,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("should not be able to register an image to a not active farm", async () => {
    const user = makeUser();
    user.verify();
    usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id, status: "INACTIVE" });
    farmsRepository.create(farm);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    await expect(
      sut.execute({
        user_id: user.id.value,
        farm_id: farm.id.value,
        image: mockedImage,
      })
    ).rejects.toBeInstanceOf(FarmNotActiveError);
  });
  it("should not be able to register an image to a farm that the user is not the admin", async () => {
    const user = makeUser();
    user.verify();
    usersRepository.create(user);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    await expect(
      sut.execute({
        user_id: user.id.value,
        farm_id: farm.id.value,
        image: mockedImage,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
  it("should not be able to register an image to another farm", async () => {
    const user = makeUser();
    user.verify();
    usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id, status: "ACTIVE" });
    farmsRepository.create(farm);

    const anotherFarm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(anotherFarm);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    await expect(
      sut.execute({
        user_id: user.id.value,
        farm_id: anotherFarm.id.value,
        image: mockedImage,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
  it("should not be able to register more than 4 images to a farm", async () => {
    const user = makeUser();
    user.verify();
    usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id, status: "ACTIVE" });
    farmsRepository.create(farm);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      image: mockedImage,
    });
    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      image: mockedImage,
    });
    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      image: mockedImage,
    });
    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      image: mockedImage,
    });

    await expect(
      sut.execute({
        user_id: user.id.value,
        farm_id: farm.id.value,
        image: mockedImage,
      })
    ).rejects.toBeInstanceOf(ResourceReachedLimitError);
    expect(farm.images.size).toBe(4);
  });
  it("should not be able to register an image without a user", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    await expect(
      sut.execute({
        user_id: new UUID().value,
        farm_id: farm.id.value,
        image: mockedImage,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
