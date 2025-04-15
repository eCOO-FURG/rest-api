// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

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
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let offersRepository: InMemoryOffersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let sut: DeleteOfferUseCase;

describe("delete offer", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    offersRepository = new InMemoryOffersRepository();
    catalogsRepository = new InMemoryCatalogsRepository();

    sut = new DeleteOfferUseCase(offersRepository, catalogsRepository, cyclesRepository);
  });

  it("should be able to delete an offer", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const catalog = makeCatalog({
      farm_id: farm.id,
      farm,
      cycle_id: cycle.id,
      cycle,
    });

    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog_id: catalog.id,
      catalog,
    });

    offersRepository.items.push(offer);

    await sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value });

    const deletedOffer = await offersRepository.find("offer", {
      id: offer.id.value,
    });

    expect(deletedOffer).toBeNull();
    expect(offersRepository.items.length).toBe(0);
  });

  it("should not be able to delete a nonexistent offer", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    await expect(() => sut.execute({ farm_id: farm.id.value, offer_id: "123" })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from a nonexistent cycle", async () => {
    const farm = makeFarm({ status: "ACTIVE" });

    const product = makeProduct();

    const catalog = makeCatalog({
      farm,
    });
    catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog,
      product_id: product.id,
    });

    offersRepository.items.push(offer);
    catalog.offers.push(offer);
    catalogsRepository.update(catalog);

    await expect(() => sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from another farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const anotherFarm = makeFarm({ status: "ACTIVE" });

    const product = makeProduct();

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

    catalog.offers.push(offer);
    catalogsRepository.update(catalog);

    await expect(() => sut.execute({ farm_id: farm.id.value, offer_id: offer.id.value })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
