// Use-cases
import { DeleteFarmImageUseCase } from "@/core/use-cases/delete-farm-image";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeUser } from "@/test/factories/make-user";

// Storage
import { MockedStorage } from "@/test/storage/mocked-storage";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

// Types
import { File } from "@/core/types/file";

let farmsRepository: InMemoryFarmsRepository;
let usersRepository: InMemoryUsersRepository;

let storage: MockedStorage;

let sut: DeleteFarmImageUseCase;

describe("delete farm image", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    usersRepository = new InMemoryUsersRepository();
    storage = new MockedStorage();

    sut = new DeleteFarmImageUseCase(farmsRepository, usersRepository, storage);
  });

  it("should be able to delete a farm image", async () => {
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

    const url = await storage.upload([mockedImage], "farms");

    farm.images.push(url[0]);

    await farmsRepository.update(farm);

    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      image_url: url[0],
    });

    expect(farm.images.length).toBe(0);
  });

  it("should not be able to delete a nonexistent farm image", async () => {
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

    const url = await storage.upload([mockedImage], "farms");

    farm.images.push(url[0]);

    await farmsRepository.update(farm);

    await expect(
      sut.execute({
        user_id: user.id.value,
        farm_id: farm.id.value,
        image_url: "nonexistent-image",
      })
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it("should not be able to delete an image from a nonexistent farm", async () => {
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
        image_url: "nonexistent-image",
      })
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it("should not be able to delete an image from another farm", async () => {
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

    const url = await storage.upload([mockedImage], "farms");

    farm.images.push(url[0]);

    await farmsRepository.update(farm);

    await expect(
      sut.execute({
        user_id: user.id.value,
        farm_id: anotherFarm.id.value,
        image_url: url[0],
      })
    ).rejects.toThrow(UnauthorizedError);
  });
  it("should not be able to delete an image without a user", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const mockedImage: File = {
      name: "image.jpg",
      mimetype: "image/jpeg",
      size: 100,
      content: Buffer.from("image"),
    };

    const url = await storage.upload([mockedImage], "farms");

    farm.images.push(url[0]);

    await farmsRepository.update(farm);

    await expect(
      sut.execute({
        user_id: new UUID().value,
        farm_id: farm.id.value,
        image_url: url[0],
      })
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
