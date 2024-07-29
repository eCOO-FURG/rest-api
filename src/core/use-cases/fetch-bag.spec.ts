// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";

// Entities
import { BagAggregate } from "@/core/entities/value-objects/bag-aggregate";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { makeOrder } from "@/test/factories/make-order";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";
import { OrderAggregate } from "../entities/value-objects/order-aggregate";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;

let repositories: {
  bags: InMemoryBagsRepository;
  orders: InMemoryOrdersRepository;
};

let sut: FetchBagUseCase;

describe("Fetch bag", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );

    repositories = {
      bags: new InMemoryBagsRepository(usersRepository),
      orders: new InMemoryOrdersRepository(
        offersRepository,
        productsRepository
      ),
    };

    sut = new FetchBagUseCase(repositories.bags, repositories.orders);
  });

  it("should be able to fetch a user bag", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const bag = makeBag({ user_id: user.id });
    await repositories.bags.create(bag);

    const product = makeProduct();
    await productsRepository.create(product);

    const offer = makeOffer({ product_id: product.id });
    await offersRepository.create(offer);

    const order = makeOrder({ bag_id: bag.id, offer_id: offer.id });
    await repositories.orders.createMany([order]);

    const result = await sut.execute({
      bag_id: bag.id.value,
    });

    expect(result.bag).toBeInstanceOf(BagAggregate);
    expect(result.orders).toBeInstanceOf(Array<OrderAggregate>);
    expect(result.orders.length).toBe(1);
  });

  it("should not be able to fetch a bag that does not exists", async () => {
    await expect(() =>
      sut.execute({
        bag_id: "1234",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
