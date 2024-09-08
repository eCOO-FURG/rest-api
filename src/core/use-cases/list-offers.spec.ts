// Use-cases
import { ListOffersUseCase } from "@/core/use-cases/list-offers";

import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeOffer } from "@/test/factories/make-offer";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let offersRepository: InMemoryOffersRepository;
let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;

let sut: ListOffersUseCase;

describe("List producer offers", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(productsRepository);
    catalogsRepository = new InMemoryCatalogsRepository(farmsRepository, offersRepository);

    sut = new ListOffersUseCase(cyclesRepository, catalogsRepository, offersRepository);
  });

  it("should be able to list offers for a valid catalog and cycle", async () => {
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

    const offer = makeOffer({ catalog_id: catalog.id });
    await offersRepository.create(offer);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      admin_id: farm.admin_id.value,
    });

    expect(result.offers).toHaveLength(1);
    expect(result.offers[0].id.value).toBe(offer.id.value);
  });

  it("should throw an error if the cycle does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "non-existent-cycle",
        admin_id: "any-admin-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error if the catalog does not exist for the cycle", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        cycle_id: cycle.id.value,
        admin_id: farm.admin_id.value,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error if no offers exist for the catalog", async () => {
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

    await expect(() =>
      sut.execute({
        cycle_id: cycle.id.value,
        admin_id: farm.admin_id.value,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
