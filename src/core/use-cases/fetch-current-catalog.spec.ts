// Use-cases
import { FetchCurrentCatalogUseCase } from "@/core/use-cases/fetch-current-catalog";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let farmsRepository: InMemoryFarmsRepository;

let sut: FetchCurrentCatalogUseCase;

describe("Fetch current catalog", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();

    catalogsRepository = new InMemoryCatalogsRepository();
    cyclesRepository = new InMemoryCyclesRepository();

    sut = new FetchCurrentCatalogUseCase(
      cyclesRepository,
      farmsRepository,
      catalogsRepository
    );
  });

  it("should be able to fetch the current catalog from a farm in a cycle", async () => {
    const user = makeUser();

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const catalog = makeCatalog({
      cycle_id: cycle.id,
      farm_id: farm.id,
    });
    await catalogsRepository.create(catalog);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      farm_id: farm.id.value,
      page: 1,
    });

    expect(result.catalog.id.value).toBe(catalog.id.value);
  });

  it("should not be able to fetch a catalog that does not exist", async () => {
    const user = makeUser();

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to fetch a catalog in a non existent cycle", async () => {
    const user = makeUser();

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    await expect(() =>
      sut.execute({
        cycle_id: "non-existent-cycle",
        farm_id: farm.id.value,
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to fetch a catalog from a non existent farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        cycle_id: cycle.id.value,
        farm_id: "non-existent-farm",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error if the cycle and farm do not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "non-existent-cycle",
        farm_id: "non-existent-farm",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
