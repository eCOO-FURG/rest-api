// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeCatalog } from "@/test/factories/make-catalog";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let sut: DeleteOfferUseCase;

describe("delete offer", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    catalogsRepository = new InMemoryCatalogsRepository();
    sut = new DeleteOfferUseCase(farmsRepository, catalogsRepository);
  });

  it("should be able to delete an offer", async () => {
    const farm = makeFarm();

    await farmsRepository.create(farm);

    const catalog = makeCatalog({ farm_id: farm.id });
    const offer = makeOffer({ catalog_id: catalog.id });

    catalog.offers.set(offer.id.value, offer);

    await catalogsRepository.create(catalog);

    await sut.execute({
      offer_id: offer.id.value,
      farm_id: farm.id.value,
    });

    expect(catalogsRepository.items[0].offers.size).toBe(0);
  });

  it("should not be able to delete a non-existing offer", async () => {
    await expect(
      sut.execute({
        offer_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from a non-existing catalog", async () => {
    await expect(
      sut.execute({
        offer_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from another catalog", async () => {
    await expect(
      sut.execute({
        offer_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
