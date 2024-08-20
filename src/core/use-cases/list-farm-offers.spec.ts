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
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeUser } from "@/test/factories/make-user";

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

let sut: ListFarmOffersUseCase;

describe("list farm offers", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(productsRepository);
    ordersRepository = new InMemoryOrdersRepository(offersRepository);
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
      orders: ordersRepository,
    };

    sut = new ListFarmOffersUseCase(
      repositories.farms,
      repositories.cycles,
      repositories.offers
    );
  });

  it("should be able to list a farm offers", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id });
    await repositories.farms.create(farm);

    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

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
    ordersRepository;

    expect(result.offers).toHaveLength(1);
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
    repositories.cycles.items.push(cycle);

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
