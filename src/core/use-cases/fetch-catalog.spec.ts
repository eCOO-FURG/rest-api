// Use-cases
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";

// Services
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeUser } from "@/test/factories/make-user";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { makeCatalog } from "@/test/factories/make-catalog";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let farmsRepository: InMemoryFarmsRepository;

let repositories: {
  catalogs: InMemoryCatalogsRepository;
};

let sut: FetchCatalogUseCase;

describe("list farm offers", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(productsRepository);
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);
    cyclesRepository = new InMemoryCyclesRepository();

    repositories = {
      catalogs: new InMemoryCatalogsRepository(
        farmsRepository,
        offersRepository
      ),
    };

    sut = new FetchCatalogUseCase(repositories.catalogs);
  });

  it("should be able to fetch a farm catalog", async () => {
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
      product: "Apple",
      page: 1,
    });
    ordersRepository;

    expect(result.catalog.offers).toHaveLength(1);
  });

  it("should not be able to fetch a catalog that does not exist", async () => {
    await expect(() =>
      sut.execute({
        catalog_id: "1",
        product: "App",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
