// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Use-cases
import { FetchFarmUseCase } from "@/core/use-cases/fetch-farm";

// Test
import { makeUser } from "@/test/factories/make-user";
import { makeFarm } from "@/test/factories/make-farm";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { Farm } from "@/core/entities/farm";

let farmsRepository: InMemoryFarmsRepository;

let sut: FetchFarmUseCase;

describe("Fetch farm", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();

    sut = new FetchFarmUseCase(farmsRepository);
  });

  it("should be able to fetch a farm", async () => {
    const user = makeUser();

    const farm = makeFarm({
      admin_id: user.id,
    });

    await farmsRepository.create(farm);

    const response = await sut.execute({ farm_id: farm.id.value });

    expect(response.farm).toBeInstanceOf(Farm);
  });

  it("should not be able to fetch a farm if the farm does not exist", async () => {
    await expect(() =>
      sut.execute({
        farm_id: "1234",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
