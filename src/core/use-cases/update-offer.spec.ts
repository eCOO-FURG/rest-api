// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Services
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Errors
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { InvalidFieldError } from "@/core/errors/invalid-field";
import { MissingFieldError } from "@/core/errors/missing-field";
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

let sut: UpdateOfferUseCase;
describe("update offer", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    farmsRepository = new InMemoryFarmsRepository();
    offersRepository = new InMemoryOffersRepository();
    catalogsRepository = new InMemoryCatalogsRepository();

    sut = new UpdateOfferUseCase(offersRepository, cyclesRepository);
  });
  it("should be able to update an offer", async () => {
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
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await sut.execute({
      farm_id: farm.id.value,
      offer_id: offer.id.value,
      amount: 10,
      description: "Updated description",
      price: 20,
    });

    const updatedOffer = await offersRepository.find("basic", {
      id: offer.id.value,
    });

    expect(updatedOffer!.amount).toBe(10);
    expect(updatedOffer!.description).toBe("Updated description");
    expect(updatedOffer!.price).toBe(20);
  });
  it("should not be able to update a nonexistent offer", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product,
      amount: 5,
      description: "Description",
      price: 10,
    });

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        amount: 10,
        description: "Updated description",
        price: 20,
      })
    ).rejects.toThrowError(ResourceNotFoundError);
  });
  it("should not be able to update an offer from a nonexistent farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product,
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: new UUID().value,
        offer_id: offer.id.value,
        amount: 10,
        description: "Updated description",
        price: 20,
      })
    ).rejects.toThrowError(UnauthorizedError);
  });
  it("should not be able to update an offer from a not active farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "INACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product,
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        amount: 10,
        description: "Updated description",
        price: 20,
      })
    ).rejects.toThrowError(FarmNotActiveError);
  });
  it("should not be able to update an offer from a nonexistent cycle", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct();
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle_id: new UUID(),
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product,
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        amount: 10,
        description: "Updated description",
        price: 20,
      })
    ).rejects.toThrowError(ResourceNotFoundError);
  });
  it("should not be able to update an offer off the cycle's offering days", async () => {
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
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        amount: 10,
        description: "Updated description",
        price: 20,
      })
    ).rejects.toThrowError(ResourceClosedError);
  });
  it("should not be able to update an offer from another farm", async () => {
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
      cycle,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product,
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        amount: 10,
        description: "Updated description",
        price: 20,
      })
    ).rejects.toThrowError(UnauthorizedError);
  });
  it("should not be able to update an offer that has orders", async () => {});
  it("should not be able to update an offer without at least one field to update", async () => {
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
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
      })
    ).rejects.toThrowError(MissingFieldError);
  });
  it("should throw an error if the offered product is not perishable and expires_at is set", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.create(farm);

    const product = makeProduct({ perishable: false });
    productsRepository.create(product);

    const catalog = makeCatalog({
      farm,
      cycle_id: cycle.id,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
      product,
      amount: 5,
      description: "Description",
      price: 10,
    });
    offersRepository.items.push(offer);

    catalog.offers.set(offer.id.value, offer);
    catalogsRepository.update(catalog);

    await expect(
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        expires_at: new Date(),
      })
    ).rejects.toThrowError(InvalidFieldError);
  });
});
