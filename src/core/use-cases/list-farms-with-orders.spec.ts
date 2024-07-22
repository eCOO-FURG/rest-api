// Use-cases
import { ListFarmsWithOrdersUsecase } from "@/core/use-cases/list-farms-with-orders";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";
import { makeOrder } from "@/test/factories/make-order";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let productsRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: ListFarmsWithOrdersUsecase;

let repositories: {
  farms: InMemoryFarmsRepository;
  cycles: InMemoryCyclesRepository;
};

describe("list farms with orders", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );
    ordersRepository = new InMemoryOrdersRepository(offersRepository, productsRepository);

    repositories = {
      cycles: cyclesRepository,
      farms: new InMemoryFarmsRepository(
        usersRepository,
        offersRepository,
        productsRepository,
        ordersRepository
      ),
    };

    sut = new ListFarmsWithOrdersUsecase(
      repositories.cycles,
      repositories.farms
    );
  });

  it("should not be able to list farms with orders from a cycle that does not exists", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to list farms with orders", async () => {
    const farm = makeFarm({
      name: "Fazenda 1",
    });

    await repositories.farms.create(farm);

    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
      product_id: product.id,
    });

    await offersRepository.create(offer);

    const order = makeOrder({
      offer_id: offer.id,
    });

    await ordersRepository.createMany([order]);

    const { farms } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
    });

    expect(farms).toHaveLength(1);
    expect(farms).toEqual([expect.objectContaining({ name: "Fazenda 1" })]);
  });

  it("should be able to search farms with orders", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    for (let i = 1; i <= 10; i++) {
      const farm = makeFarm({
        name: `Fazenda ${i}`,
      });

      await repositories.farms.create(farm);

      const offer = makeOffer({
        farm_id: farm.id,
        cycle_id: cycle.id,
        product_id: product.id,
      });

      await offersRepository.create(offer);

      const order = makeOrder({
        offer_id: offer.id,
      });

      await ordersRepository.createMany([order]);
    }

    const { farms } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      name: "Fazenda 8",
    });

    expect(farms).toHaveLength(1);
    expect(farms).toEqual([expect.objectContaining({ name: "Fazenda 8" })]);
  });

  it("should be able to list paginated farms with orders", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    for (let i = 1; i <= 22; i++) {
      const farm = makeFarm({
        name: `Fazenda ${i}`,
      });

      await repositories.farms.create(farm);

      const offer = makeOffer({
        farm_id: farm.id,
        cycle_id: cycle.id,
        product_id: product.id,
      });

      await offersRepository.create(offer);

      const order = makeOrder({
        offer_id: offer.id,
      });

      await ordersRepository.createMany([order]);
    }

    const { farms } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 2,
    });

    expect(farms).toHaveLength(2);
  });
});
