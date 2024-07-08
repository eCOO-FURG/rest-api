// Use-cases
import { SearchOfferingFarmsUseCase } from "@/core/use-cases/search-offering-farms";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";

// Errors
import { ResourceNotFoundError } from "../errors/resource-not-found";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

let sut: SearchOfferingFarmsUseCase;

let cyclesRepository: InMemoryCyclesRepository;
let usersRepository: InMemoryUsersRepository;
let offersRepository: InMemoryOffersRepository;
let productsRepository: InMemoryProductsRepository;
let ordersRepository: InMemoryOrdersRepository;

let repositories: {
  farms: InMemoryFarmsRepository;
  cycles: InMemoryCyclesRepository;
};

describe("searh offering farms", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );
    ordersRepository = new InMemoryOrdersRepository(offersRepository);

    repositories = {
      farms: new InMemoryFarmsRepository(
        usersRepository,
        offersRepository,
        productsRepository,
        ordersRepository
      ),
      cycles: cyclesRepository,
    };

    sut = new SearchOfferingFarmsUseCase(
      repositories.cycles,
      repositories.farms
    );
  });

  it("should be able to list offering farms", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct({
      name: "Potato",
    });

    await productsRepository.create(product);

    for (let i = 0; i < 25; i++) {
      const farm = makeFarm();
      await repositories.farms.create(farm);

      const offer = makeOffer({
        cycle_id: cycle.id,
        product_id: product.id,
        farm_id: farm.id,
      });
      await offersRepository.create(offer);
    }

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      page: 2,
      product: "Pota",
    });

    expect(result.farms.length).toBe(5);
  });

  it("should not be able to search offers from a cycle that does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        page: 2,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
