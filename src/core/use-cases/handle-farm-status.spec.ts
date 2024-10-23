// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { HandleFarmStatusUseCase } from "./handle-farm-status";

// Services
import { makeUser } from "@/test/factories/make-user";
import { makeFarm } from "@/test/factories/make-farm";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;

let sut: HandleFarmStatusUseCase;

describe("handle farm status", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);

    sut = new HandleFarmStatusUseCase(farmsRepository);
  });

  it("should be able to handle a farm status", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    await sut.execute({
      farm_id: farm.id.value,
      status: "INACTIVE",
    });

    expect(farmsRepository.items[0].status).toEqual("INACTIVE");
  });

  it("should not be able to handle a farm that does not exist", async () => {
    await expect(
      sut.execute({
        farm_id: "invalid-id",
        status: "INACTIVE",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
