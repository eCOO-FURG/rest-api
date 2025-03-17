// Entities
import { Catalog } from "@/core/entities/catalog";

// Use-cases
import { FetchCatalogUseCase } from "@/core/use-cases/fetch-catalog";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";
import { makeCatalog } from "@/test/factories/make-catalog";

// Repositories
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let catalogsRepository: InMemoryCatalogsRepository;

let sut: FetchCatalogUseCase;

describe("fetch catalog", () => {
  beforeEach(() => {
    catalogsRepository = new InMemoryCatalogsRepository();

    sut = new FetchCatalogUseCase(catalogsRepository);
  });

  it("should be able to fetch a catalog", async () => {
    const user = makeUser();

    const farm = makeFarm({ admin_id: user.id });

    const cycle = makeCycle();

    const product = makeProduct({ name: "Apple" });

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
      product,
    });

    catalog.offers.push(offer);

    await catalogsRepository.create(catalog);

    const result = await sut.execute({
      catalog_id: catalog.id.value,
      product: "App",
      page: 1,
    });

    expect(result.catalog).toBeInstanceOf(Catalog);
  });

  it("should not be able to fetch a catalog that does not exists", async () => {
    await expect(() =>
      sut.execute({
        catalog_id: "123456",
        product: "App",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
