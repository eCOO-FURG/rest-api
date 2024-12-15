// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Use-cases
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";

// Services
import { makeFarm } from "@/test/factories/make-farm";

let farmsRepository: InMemoryFarmsRepository;

let sut: ListFarmsUseCase;

describe("list farms", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    sut = new ListFarmsUseCase(farmsRepository);
  });

  it("should be able to list farms", async () => {
    const farm1 = makeFarm();
    farmsRepository.items.push(farm1);

    const response = await sut.execute({
      page: 1,
    });

    expect(response.farms).toHaveLength(1);
  });

  it("should be able to list farms by name", async () => {
    const farm1 = makeFarm({ name: "Farm 1" });
    farmsRepository.items.push(farm1);

    const farm2 = makeFarm({ name: "Farm 2" });
    farmsRepository.items.push(farm2);

    const response = await sut.execute({
      page: 1,
      name: "Farm 1",
    });

    expect(response.farms).toHaveLength(1);
    expect(response.farms[0].name).toBe("Farm 1");
  });
});
