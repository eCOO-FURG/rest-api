// Use-cases
import { SearchCatalogsUseCase } from "@/core/use-cases/search-catalogs";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { makeCatalog } from "@/test/factories/make-catalog";

let sut: SearchCatalogsUseCase;

let cyclesRepository: InMemoryCyclesRepository;
let usersRepository: InMemoryUsersRepository;
let offersRepository: InMemoryOffersRepository;
let productsRepository: InMemoryProductsRepository;
let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let repositories: {
  cycles: InMemoryCyclesRepository;
  catalogs: InMemoryCatalogsRepository;
};

describe("searh offering farms", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);

    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      catalogsRepository
    );

    catalogsRepository = new InMemoryCatalogsRepository(
      farmsRepository,
      offersRepository
    );

    offersRepository.inMemoryCatalogsRepository = catalogsRepository;

    repositories = {
      cycles: cyclesRepository,
      catalogs: catalogsRepository,
    };

    sut = new SearchCatalogsUseCase(repositories.cycles, repositories.catalogs);
  });

  it("should be able to list catalogs", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct({
      name: "Potato",
    });

    await productsRepository.create(product);

    for (let i = 0; i < 5; i++) {
      const user = makeUser();
      await usersRepository.create(user);

      const farm = makeFarm({ admin_id: user.id });
      await farmsRepository.create(farm);

      const catalog = makeCatalog({
        farm_id: farm.id,
        cycle_id: cycle.id,
      });
      await repositories.catalogs.create(catalog);

      const offer = makeOffer({
        catalog_id: catalog.id,
        product_id: product.id,
      });
      await offersRepository.create(offer);
    }

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      product: "Pota",
    });

    expect(result.catalogs.length).toBe(5);
  });

  it("should not be able to search catelogs from a cycle that does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
