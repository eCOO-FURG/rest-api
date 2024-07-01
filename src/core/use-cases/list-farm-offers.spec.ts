// Use-cases
import { ListFarmOffersUseCase } from "@/core/use-cases/list-farm-offers";

// Services
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository

let repositories: {
  farms: InMemoryFarmsRepository;
  cycles: InMemoryCyclesRepository;
  offers: InMemoryOffersRepository;
};

let sut: ListFarmOffersUseCase;

describe("list farm offers", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );
    ordersRepository = new InMemoryOrdersRepository(offersRepository)
    usersRepository = new InMemoryUsersRepository();

    repositories = {
      farms: new InMemoryFarmsRepository(
        usersRepository,
        offersRepository,
        productsRepository,
        ordersRepository
      ),
      cycles: cyclesRepository,
      offers: offersRepository,
    };

    sut = new ListFarmOffersUseCase(
      repositories.farms,
      repositories.cycles,
      repositories.offers
    );
  });

  it("should be able to list a farm offers", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const cycle = makeCycle();
    await repositories.cycles.create(cycle);

    const product = makeProduct({ name: "Apple" });
    await productsRepository.create(product);

    const offer = makeOffer({
      farm_id: farm.id,
      product_id: product.id,
      cycle_id: cycle.id,
    });
    await repositories.offers.create(offer);

    const result = await sut.execute({
      farm_id: farm.id.value,
      cycle_id: cycle.id.value,
      product: "App",
      page: 1,
    });

    expect(result.farmWithOffers.offers).toHaveLength(1);
  });

  it("should not be able to list offers from a farm that does not exists", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        cycle_id: "123",
        product: "App",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to list offers from a cycle that does not exists", async () => {
    const cycle = makeCycle();
    await repositories.cycles.create(cycle);

    await expect(() =>
      sut.execute({
        farm_id: "123",
        cycle_id: cycle.id.value,
        product: "App",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
