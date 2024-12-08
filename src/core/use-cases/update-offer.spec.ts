// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeCycle } from "@/test/factories/make-cycle";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";
// Entities
import { Week } from "@/core/entities/cycle";
import { makeCatalog } from "@/test/factories/make-catalog";

let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: UpdateOfferUseCase;

describe("update offer", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    catalogsRepository = new InMemoryCatalogsRepository();

    sut = new UpdateOfferUseCase(
      farmsRepository,
      cyclesRepository,
      catalogsRepository
    );
  });

  it("should be able to update an offer", async () => {
    const farm = makeFarm();
    await farmsRepository.create(farm);

    const product = makeProduct();

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });

    catalog.offers.set(offer.id.value, offer);

    await catalogsRepository.create(catalog);

    await sut.execute({
      offer_id: offer.id.value,
      farm_id: farm.id.value,
      amount: 150,
    });

    expect(catalog.offers.get(offer.id.value)?.amount).toEqual(150);
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
    await farmsRepository.create(farm);

    const farm2 = makeFarm();
    await farmsRepository.create(farm2);

    const product = makeProduct();

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const catalog = makeCatalog({ cycle_id: cycle.id });
    await catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });

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
    cyclesRepository.items.push(cycle);

    const farm = makeFarm();
    await farmsRepository.create(farm);

    const product = makeProduct();

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });

    catalog.offers.set(offer.id.value, offer);

    catalogsRepository.items.push(catalog);

    await catalogsRepository.create(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        amount: 100,
      })
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });
});
