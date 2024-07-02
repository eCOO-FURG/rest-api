// Use-cases
import { ListFarmSalesUseCase } from "@/core/use-cases/list-farm-orders";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeOrder } from "@/test/factories/make-order";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;

let repositories: {
  farms: InMemoryFarmsRepository;
  cycles: InMemoryCyclesRepository;
  offers: InMemoryOffersRepository;
  orders: InMemoryOrdersRepository;
};

let sut: ListFarmSalesUseCase;

describe("list farm sales", () => {
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
      offers: offersRepository,
      orders: new InMemoryOrdersRepository(offersRepository),
    };

    sut = new ListFarmSalesUseCase(
      repositories.farms,
      repositories.cycles,
      repositories.offers,
      repositories.orders
    );
  });

  it("should be able to list a farm sales", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const cycle = makeCycle();
    await repositories.cycles.create(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    const offer = makeOffer({
      farm_id: farm.id,
      product_id: product.id,
      cycle_id: cycle.id,
    });

    await repositories.offers.create(offer);

    const order = makeOrder({
      offer_id: offer.id,
      amount: offer.amount,
    });

    await repositories.orders.create(order);

    const result = await sut.execute({
      farm_id: farm.id.value,
      cycle_id: cycle.id.value,
    });

    expect(result.orders[0].amount).toBeGreaterThan(8);
  });

  it("should not be able to list an unexisting farm sales", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to list a farm sales from an unexising cycle", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    await expect(() =>
      sut.execute({
        cycle_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
