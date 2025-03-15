// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Services
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { today } from "@/core/utils/today";

let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let usersRepository: InMemoryUsersRepository;
let bagsRepository: InMemoryBagsRepository;

let sut: DeleteOfferUseCase;

describe("delete offer", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    farmsRepository = new InMemoryFarmsRepository();
    offersRepository = new InMemoryOffersRepository();
    catalogsRepository = new InMemoryCatalogsRepository();
    usersRepository = new InMemoryUsersRepository();
    bagsRepository = new InMemoryBagsRepository();

    sut = new DeleteOfferUseCase(offersRepository, cyclesRepository);
  });
  it("should be able to delete an offer", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle_id: cycle.id,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value });

    const deletedOffer = await offersRepository.find("basic", {
      id: offer.id.value,
    });

    expect(deletedOffer).toBeNull();
    expect(offersRepository.items.length).toBe(0);
  });
  it("should not be able to delete a nonexistent offer", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    await expect(() =>
      sut.execute({ farm_id: farm.id.value, offer_id: "123" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("should not be able to delete an offer from a nonexistent farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle_id: cycle.id,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ farm_id: new UUID().value, offer_id: offer.id.value })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
  it("should not be able to delete an offer from a not active farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "INACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle_id: cycle.id,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value })
    ).rejects.toBeInstanceOf(FarmNotActiveError);
  });
  it("should not be able to delete an offer from a nonexistent cycle", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("should not be able to delete an offer off the cycle's offering days", async () => {
    const offeringDays = [1, 2, 3, 4, 5, 6, 7].filter((day) => day !== today());

    const cycle = makeCycle({
      offer: offeringDays as CycleWeek,
    });
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle_id: cycle.id,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value })
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });
  it("should not be able to delete an offer from another farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const anotherFarm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(anotherFarm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm: anotherFarm,
      cycle_id: cycle.id,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
