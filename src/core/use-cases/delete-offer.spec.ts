// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeCatalog } from "@/test/factories/make-catalog";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let productsRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let offersRepository: InMemoryOffersRepository;
let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let repositories: {
  offers: InMemoryOffersRepository;
  farms: InMemoryFarmsRepository;
  catalogs: InMemoryCatalogsRepository;
};

let sut: DeleteOfferUseCase;

describe("delete offer", () => {
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
      catalogs: catalogsRepository,
    };

    sut = new DeleteOfferUseCase(
      repositories.farms,
      repositories.offers,
      repositories.catalogs
    );
  });

  it("should be able to delete an offer", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const catalog = makeCatalog({ farm_id: farm.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({ catalog_id: catalog.id });
    await repositories.offers.create(offer);

    await sut.execute({
      offer_id: offer.id.value,
      farm_id: farm.id.value,
    });

    expect(repositories.offers.items.length).toBe(0);
  });

  it("should not be able to delete a non-existing offer", async () => {
    await expect(
      sut.execute({
        offer_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from a non-existing farm", async () => {
    const offer = makeOffer();
    await repositories.offers.create(offer);

    await expect(
      sut.execute({
        offer_id: offer.id.value,
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from another farm", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const farm2 = makeFarm();
    await repositories.farms.create(farm2);

    const catalog = makeCatalog({ farm_id: farm2.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({ catalog_id: catalog.id });
    await repositories.offers.create(offer);

    await expect(
      sut.execute({
        offer_id: offer.id.value,
        farm_id: farm.id.value,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
