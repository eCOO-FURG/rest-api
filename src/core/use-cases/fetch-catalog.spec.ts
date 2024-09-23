// Entities
import { CatalogMerge } from "@/core/entities/merged/catalog-merge";

// Use-cases
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { makeCatalog } from "@/test/factories/make-catalog";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let repositories: {
  catalogs: InMemoryCatalogsRepository;
};

let sut: FetchCatalogUseCase;

describe("list farm offers", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    usersRepository = new InMemoryUsersRepository();

    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      catalogsRepository
    );

    farmsRepository = new InMemoryFarmsRepository(usersRepository);

    catalogsRepository = new InMemoryCatalogsRepository(
      farmsRepository,
      offersRepository
    );

    offersRepository.inMemoryCatalogsRepository = catalogsRepository;
    ordersRepository = new InMemoryOrdersRepository(offersRepository);

    repositories = { catalogs: catalogsRepository };

    sut = new FetchCatalogUseCase(repositories.catalogs);
  });

  it("should be able to list a farm offers", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ name: "Apple" });
    await productsRepository.create(product);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });
    await offersRepository.create(offer);

    const result = await sut.execute({
      catalog_id: catalog.id.value,
      product: "App",
      page: 1,
    });
    ordersRepository;

    expect(result.catalog).toBeInstanceOf(CatalogMerge);
  });

  it("should not be able to list offers from a farm that does not exists", async () => {
    const farm = makeFarm();
    await farmsRepository.create(farm);

    await expect(() =>
      sut.execute({
        catalog_id: "123456",
        product: "App",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
