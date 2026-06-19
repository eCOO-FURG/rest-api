// Use-cases
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let farmsRepository: InMemoryFarmsRepository;

let sut: FetchCatalogUseCase;

describe("fetch catalog", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();

    sut = new FetchCatalogUseCase(farmsRepository);
  });

  it("should be able to fetch a catalog", async () => {
    const user = makeUser();

    const farm = makeFarm({ admin_id: user.id });

    const product = makeProduct({ name: "Apple" });

    const offer = makeOffer({
      product_id: product.id,
      product,
    });

    farm.offers.push(offer);

    await farmsRepository.create(farm);

    const result = await sut.execute({
      farm_id: farm.id.value,
      product: "App",
      page: 1,
    });

    expect(result.catalog.id.equals(farm.id)).toBe(true);
  });

  it("should not filter current cycle offers by their creation date", async () => {
    const farm = makeFarm();
    const find = vi.spyOn(farmsRepository, "find");

    await farmsRepository.create(farm);

    await sut.execute({
      farm_id: farm.id.value,
      available: "CYCLE",
      since: new Date("2026-06-14T00:00:00.000Z"),
      before: new Date("2026-06-21T00:00:00.000Z"),
      page: 1,
    });

    expect(find).toHaveBeenCalledWith(
      "catalog",
      expect.objectContaining({
        offers: expect.objectContaining({
          available: "CYCLE",
          since: undefined,
          before: undefined,
        }),
      }),
    );
  });

  it("should filter previous offers by their creation date", async () => {
    const farm = makeFarm();
    const since = new Date("2026-06-14T00:00:00.000Z");
    const before = new Date("2026-06-21T00:00:00.000Z");
    const find = vi.spyOn(farmsRepository, "find");

    await farmsRepository.create(farm);

    await sut.execute({
      farm_id: farm.id.value,
      available: false,
      since,
      before,
      page: 1,
    });

    expect(find).toHaveBeenCalledWith(
      "catalog",
      expect.objectContaining({
        offers: expect.objectContaining({
          available: false,
          since,
          before,
        }),
      }),
    );
  });

  it("should not be able to fetch a catalog that does not exists", async () => {
    await expect(() =>
      sut.execute({
        farm_id: "123456",
        product: "App",
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
