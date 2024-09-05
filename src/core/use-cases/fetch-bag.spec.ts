// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";
import { makeOrder } from "@/test/factories/make-order";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";

// Entities
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

let usersRepository: InMemoryUsersRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;

let repositories: {
  bags: InMemoryBagsRepository;
};

let sut: FetchBagUseCase;

describe("Fetch bag", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(productsRepository);
    ordersRepository = new InMemoryOrdersRepository(offersRepository);

    repositories = {
      bags: new InMemoryBagsRepository(usersRepository, ordersRepository),
    };

    sut = new FetchBagUseCase(repositories.bags);
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
    await ordersRepository.createMany([order]);

    const result = await sut.execute({
      bag_id: bag.id.value,
    });

    expect(result.bag).toBeInstanceOf(BagMerge);
    expect(result.bag.orders).toBeInstanceOf(Array<OrderAggregate>);
    expect(result.bag.orders.length).toBe(1);
  });

  it("should not be able to fetch a bag that does not exists", async () => {
    await expect(() =>
      sut.execute({
        bag_id: "1234",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
