// Factories
import { makeBox } from "@/test/factories/make-box";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeCatalogAndFarm } from "@/test/factories/make-catalog-and-farm";

// Use Cases
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeFarm } from "@/test/factories/make-farm";

let boxesRepository: InMemoryBoxesRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: FetchCurrentBoxUseCase;

describe("fetch current box", () => {
  beforeEach(() => {
    boxesRepository = new InMemoryBoxesRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    sut = new FetchCurrentBoxUseCase(boxesRepository, cyclesRepository);
  });

  it("should be able to fetch the farm current current box", async () => {
    const cycle = makeCycle({
      order: [1, 2, 3, 4, 5, 6, 7],
    });
    cyclesRepository.items.push(cycle);

    const farm = makeFarm();

    const catalog = makeCatalog({
      farm_id: farm.id,
      farm: farm,
      cycle_id: cycle.id,
    });

    await boxesRepository.create(makeBox({ catalog }));

    const { box } = await sut.execute({
      farm_id: farm.id.value,
      cycle_id: cycle.id.value,
      page: 1,
    });

    expect(box.id).toEqual(box.id);
    expect(box.catalog.farm.id).toEqual(farm.id);
  });

  it("should not be able to fetch a box with a non-existent cycle", async () => {
    const catalogAndFarm = makeCatalogAndFarm();
    const box = makeBox({
      catalog: catalogAndFarm,
    });
    await boxesRepository.create(box);

    await expect(() =>
      sut.execute({
        farm_id: catalogAndFarm.farm.id.value,
        cycle_id: "non-existent-id",
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to fetch a non-existent box", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: "non-existent-id",
        cycle_id: cycle.id.value,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
