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
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let offersRepository: InMemoryOffersRepository;
let productsRepository: InMemoryProductsRepository;

let sut: FetchLastCatalogUseCase;

describe("Fetch last catalog", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(productsRepository);
    catalogsRepository = new InMemoryCatalogsRepository(farmsRepository, offersRepository);
    cyclesRepository = new InMemoryCyclesRepository();

    sut = new FetchLastCatalogUseCase(cyclesRepository, catalogsRepository);
  });

  it("should be able to fetch the last catalog for a valid cycle and farm", async () => {
    const user = makeUser();
    await usersRepository.create(user);

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
    });

    expect(result.catalog.id.value).toBe(catalog.id.value);
  });

  it("should throw an error if the cycle does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "non-existent-cycle",
        farm_id: "any-farm-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error if the catalog does not exist for the cycle and farm", async () => {
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
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});


