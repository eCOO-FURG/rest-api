// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";
import { UpdateProducerUseCase } from "@/core/use-cases/update-producer";
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeUser } from "@/test/factories/make-user";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { MockedStorage } from "@/test/storage/mocked-storage";

let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let storage: MockedStorage;
let encrypter: MockedEncrypter;

let updateUserUseCase: UpdateUserUseCase;
let updateFarmUseCase: UpdateFarmUseCase;
let sut: UpdateProducerUseCase;

describe("admin update producer", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository();
    storage = new MockedStorage();
    encrypter = new MockedEncrypter();

    updateUserUseCase = new UpdateUserUseCase(
      usersRepository,
      encrypter,
      storage,
    );
    updateFarmUseCase = new UpdateFarmUseCase(
      farmsRepository,
      usersRepository,
      storage,
    );

    sut = new UpdateProducerUseCase(
      farmsRepository,
      updateUserUseCase,
      updateFarmUseCase,
    );
  });

  it("should be able to update a producer", async () => {
    const producer = makeUser({
      first_name: "John",
      last_name: "Doe",
      roles: ["USER", "PRODUCER"],
    });
    await usersRepository.create(producer);

    const farm = makeFarm({ admin_id: producer.id, name: "Old Farm" });
    await farmsRepository.create(farm);

    await sut.execute({
      farm_id: farm.id.value,
      first_name: "Jane",
      name: "New Farm",
    });

    expect(usersRepository.items[0].first_name).toBe("Jane");
    expect(farmsRepository.items[0].name).toBe("New Farm");
  });

  it("should return error if farm does not exist", async () => {
    await expect(() =>
      sut.execute({
        farm_id: "non-existent-farm-id",
        first_name: "Jane",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
