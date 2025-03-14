// Use-cases
import { UpdateFarmUseCase } from "@/core/use-cases/update-farm";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { MockedStorage } from "@/test/storage/mocked-storage";
import { makeFile } from "@/test/factories/make-file";
import { makeUser } from "@/test/factories/make-user";
let farmsRepository: InMemoryFarmsRepository;
let usersRepository: InMemoryUsersRepository;
let storage: MockedStorage;

let sut: UpdateFarmUseCase;

describe("update farm", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    usersRepository = new InMemoryUsersRepository();
    storage = new MockedStorage();

    sut = new UpdateFarmUseCase(farmsRepository, usersRepository, storage);
  });

  it("should be able to update more than one farm field", async () => {
    const user = makeUser({ roles: ["MANAGER"] });
    await usersRepository.create(user);

    const farm = makeFarm({
      images: new Map([["image1", "image1"]]),
    });

    await farmsRepository.create(farm);

    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      name: "Cláudio",
      tally: "123456",
      description: "Descrição",
      photo: makeFile(),
    });

    expect(farmsRepository.items[0].name).toEqual("Cláudio");
    expect(farmsRepository.items[0].tally).toEqual("123456");
    expect(farmsRepository.items[0].description).toEqual("Descrição");
    expect(farmsRepository.items[0].photo).toBeTruthy();
  });
});
