// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeCycle } from "@/test/factories/make-cycle";

// Repositories
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";
// Entities
import { Week } from "@/core/entities/cycle";
import { makeCatalog } from "@/test/factories/make-catalog";

let productsRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let offersRepository: InMemoryOffersRepository;
let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let repositories: {
  offers: InMemoryOffersRepository;
  farms: InMemoryFarmsRepository;
  cycles: InMemoryCyclesRepository;
  catalogs: InMemoryCatalogsRepository;
};

let sut: UpdateOfferUseCase;

describe("update offer", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    usersRepository = new InMemoryUsersRepository();
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
      offers: offersRepository,
      farms: farmsRepository,
      cycles: new InMemoryCyclesRepository(),
      catalogs: new InMemoryCatalogsRepository(
        farmsRepository,
        offersRepository
      ),
    };

    sut = new UpdateOfferUseCase(
      repositories.farms,
      repositories.offers,
      repositories.cycles,
      repositories.catalogs
    );
  });

  it("should be able to update an offer", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const product = makeProduct();
    await productsRepository.create(product);

    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
    repositories.catalogs.create(catalog);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });
    await repositories.offers.create(offer);

    await sut.execute({
      offer_id: offer.id.value,
      farm_id: farm.id.value,
      amount: 150,
    });

    expect(repositories.offers.items[0].amount).toEqual(150);
  });

  it("should not be able to update a non-existing offer", async () => {
    await expect(
      sut.execute({
        offer_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update an offer from another farm", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const farm2 = makeFarm();
    await repositories.farms.create(farm2);

    const product = makeProduct();
    await productsRepository.create(product);

    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const catalog = makeCatalog({ cycle_id: cycle.id });
    repositories.catalogs.create(catalog);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });
    await repositories.offers.create(offer);

    await expect(
      sut.execute({
        offer_id: offer.id.value,
        farm_id: farm.id.value,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update an offer past the cycle offering days", async () => {
    const today = (new Date().getDay() + 1) as Week[0];

    const offeringDays = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today);

    const cycle = makeCycle({
      offer: offeringDays as Week,
    });
    repositories.cycles.items.push(cycle);

    const farm = makeFarm();
    await repositories.farms.create(farm);

    const product = makeProduct();
    await productsRepository.create(product);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
    repositories.catalogs.create(catalog);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });
    await repositories.offers.create(offer);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        amount: 100,
      })
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });
});
