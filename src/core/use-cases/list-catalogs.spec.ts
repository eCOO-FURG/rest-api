// Use-cases
import { ListCatalogsUseCase } from "@/core/use-cases/list-catalogs";

// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Services
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let sut: ListCatalogsUseCase;

let cyclesRepository: InMemoryCyclesRepository;
let farmsRepository: InMemoryFarmsRepository;
let categoriesRepository: InMemoryCategoriesRepository;
let marketRepository: InMemoryMarketsRepository;

describe("list catalogs", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    farmsRepository = new InMemoryFarmsRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    marketRepository = new InMemoryMarketsRepository();

    sut = new ListCatalogsUseCase(
      cyclesRepository,
      marketRepository,
      farmsRepository,
      categoriesRepository,
    );
  });

  it("should be able to list catalogs", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({
      name: "Potato",
    });

    for (let i = 0; i < 5; i++) {
      const user = makeUser();

      const farm = makeFarm({ admin_id: user.id, admin: user });

      const offer = makeOffer({
        farm_id: farm.id,
        product_id: product.id,
        product,
      });

      farm.offers.push(offer);
      farmsRepository.items.push(farm);
    }

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      product: "Pota",
    });

    expect(result.catalogs.length).toBe(5);
  });

  it("should not be able to list catalogs from a cycle that does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to list catalogs filtered by a product category that does not exist", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        cycle_id: cycle.id.value,
        page: 1,
        category_id: "123",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
