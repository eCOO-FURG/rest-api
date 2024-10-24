// Use-cases
import { UpdateFarmUseCase } from "./update-farm";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { makeFarm } from "@/test/factories/make-farm";

let repositories: {
  farms: InMemoryFarmsRepository;
};



let sut: UpdateFarmUseCase;

describe("update user", () => {
  beforeEach(() => {
    const users = new InMemoryUsersRepository();
    repositories = {
      farms: new InMemoryFarmsRepository(users),
    };

    sut = new UpdateFarmUseCase(repositories.farms);
  });

  it("should be able to update more than one farm field", async () => {
    const farm = makeFarm();

    await repositories.farms.create(farm);

    await sut.execute({
      farm_id: farm.id.value,
      name: "Cláudio",
      counterfoil_number: "123456",
      description: "Descrição",
    });

    expect(repositories.farms.items[0].name).toEqual("Cláudio");
    expect(repositories.farms.items[0].counterfoil_number).toEqual("123456");
    expect(repositories.farms.items[0].description).toEqual("Descrição");
  });


});
