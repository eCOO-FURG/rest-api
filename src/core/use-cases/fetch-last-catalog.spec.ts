// Use-cases
import { FetchLastCatalogUseCase } from "@/core/use-cases/fetch-last-catalog";

import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { mostPast } from "@/core/utils/most-past";

let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;

let sut: FetchLastCatalogUseCase;

describe("Fetch last catalog", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository();

    catalogsRepository = new InMemoryCatalogsRepository();

    cyclesRepository = new InMemoryCyclesRepository();

    sut = new FetchLastCatalogUseCase(
      cyclesRepository,
      farmsRepository,
      catalogsRepository
    );
  });

  it("should be able to fetch the last catalog from a farm in a cycle", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const lastCycle = new Date(mostPast(cycle.offer).getTime() - 1 * 60 * 1000);

    const catalog = makeCatalog({
      cycle_id: cycle.id,
      farm_id: farm.id,
      created_at: mostPast(cycle.offer),
    });
    await catalogsRepository.create(catalog);

    const lastCatalog = makeCatalog({
      cycle_id: cycle.id,
      farm_id: farm.id,
      created_at: lastCycle,
    });
    await catalogsRepository.create(lastCatalog);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      farm_id: farm.id.value,
      page: 1,
    });

    expect(result.catalog.id.value).toBe(lastCatalog.id.value);
  });

  it("should not be able to fetch a catalog that does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

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
    await usersRepository.create(user);

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
