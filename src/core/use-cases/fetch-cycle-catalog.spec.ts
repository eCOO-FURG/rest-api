// Entities
import { Catalog } from "@/core/entities/catalog";

// Use-cases
import { FetchCycleCatalogUseCase } from "@/core/use-cases/fetch-cycle-catalog";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";
import { makeCatalog } from "@/test/factories/make-catalog";

// Repositories
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let catalogsRepository: InMemoryCatalogsRepository;
let cyclesRepository: InMemoryCyclesRepository;
let sut: FetchCycleCatalogUseCase;

describe("fetch cycle catalog", () => {
  beforeEach(() => {
    catalogsRepository = new InMemoryCatalogsRepository();
    cyclesRepository = new InMemoryCyclesRepository();

    sut = new FetchCycleCatalogUseCase(cyclesRepository, catalogsRepository);
  });

  it("should be able to fetch a catalog by cycle", async () => {
    const user = makeUser();
    const farm = makeFarm({ admin_id: user.id });
    const cycle = makeCycle();
    const product = makeProduct({ name: "Apple" });

    const catalog = makeCatalog({
      farm_id: farm.id,
      cycle_id: cycle.id,
    });

    cyclesRepository.items.push(cycle);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
      product,
    });

    catalog.offers.push(offer);

    await catalogsRepository.create(catalog);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      farm_id: farm.id.value,
      product: "App",
      page: 1,
    });

    expect(result.catalog).toBeInstanceOf(Catalog);
  });

  it("should not be able to fetch a catalog from a cycle that does not exists", async () => {
    const farm = makeFarm();

    await expect(() =>
      sut.execute({
        cycle_id: "123456",
        farm_id: farm.id.value,
        product: "App",
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to filter catalog by availability", async () => {
    const user = makeUser();
    const farm = makeFarm({ admin_id: user.id });
    const cycle = makeCycle();
    const product = makeProduct({ name: "Apple" });

    const catalog = makeCatalog({
      farm_id: farm.id,
      cycle_id: cycle.id,
    });

    cyclesRepository.items.push(cycle);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
      product,
    });

    catalog.offers.push(offer);

    await catalogsRepository.create(catalog);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      farm_id: farm.id.value,
      available: true,
      page: 1,
    });

    expect(result.catalog).toBeInstanceOf(Catalog);
    expect(result.catalog.offers).toHaveLength(1);
  });

  it("should be able to filter catalog by date range", async () => {
    const user = makeUser();
    const farm = makeFarm({ admin_id: user.id });
    const cycle = makeCycle();
    const product = makeProduct({ name: "Apple" });

    const catalog = makeCatalog({
      farm_id: farm.id,
      cycle_id: cycle.id,
    });

    cyclesRepository.items.push(cycle);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
      product,
    });

    catalog.offers.push(offer);

    await catalogsRepository.create(catalog);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      farm_id: farm.id.value,
      since: new Date("2024-01-01"),
      before: new Date("2024-12-31"),
      page: 1,
    });

    expect(result.catalog).toBeInstanceOf(Catalog);
  });
});
