// Entities
import { Week } from "@/core/entities/cycle";

// Use-cases
import { OrderProductsUseCase } from "@/core/use-cases/order-products";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ClosedActionError } from "@/core/errors/closed-action";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { InvalidWeightError } from "@/core/errors/invalid-weight";

// Services
import { makeOffer } from "@/test/factories/make-offer";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeUser } from "@/test/factories/make-user";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;

let repositories: {
  users: InMemoryUsersRepository;
  offers: InMemoryOffersRepository;
  orders: InMemoryOrdersRepository;
  products: InMemoryProductsRepository;
};

let sut: OrderProductsUseCase;

describe("order product", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );

    repositories = {
      users: new InMemoryUsersRepository(),
      products: productsRepository,
      offers: offersRepository,
      orders: new InMemoryOrdersRepository(offersRepository),
    };

    sut = new OrderProductsUseCase(
      repositories.users,
      repositories.offers,
      repositories.orders
    );
  });

  it("should be able to order a product from an offer", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const offer = makeOffer({
      product_id: product.id,
      cycle_id: cycle.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await sut.execute({
      user_id: user.id.value,
      offer_id: offer.id.value,
      amount: 5,
    });

    expect(repositories.orders.items.length).toBe(1);
    expect(offer.amount).toBe(5);
  });

  it("should not allow an non existing user to create an order", async () => {
    await expect(() =>
      sut.execute({
        user_id: "1234",
        offer_id: "1234",
        amount: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able create an order from a non existing offer", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        offer_id: "1234",
        amount: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able create an order from a non existing cycle", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const product = makeProduct();
    await repositories.products.create(product);

    const offer = makeOffer({
      product_id: product.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        offer_id: offer.id.value,
        amount: 5,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able create an order outside the cycle day", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const today = (new Date().getDay() + 1) as Week[0];

    const offerDays = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today);

    const cycle = makeCycle({
      offer: offerDays as Week,
    });

    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const offer = makeOffer({
      product_id: product.id,
      cycle_id: cycle.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        offer_id: offer.id.value,
        amount: 5,
      })
    ).rejects.toBeInstanceOf(ClosedActionError);
  });

  it("should not be able create an order with same offer", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const offer = makeOffer({
      product_id: product.id,
      cycle_id: cycle.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await sut.execute({
      user_id: user.id.value,
      offer_id: offer.id.value,
      amount: 5,
    });

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        offer_id: offer.id.value,
        amount: 5,
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able create an order with an amount greater than the offer", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const offer = makeOffer({
      product_id: product.id,
      cycle_id: cycle.id,
      amount: 5,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        offer_id: offer.id.value,
        amount: 15,
      })
    ).rejects.toBeInstanceOf(UnavailableAmountError);
  });

  it("should not be able create an order with an invalid amount", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({
      pricing: "WEIGHT",
    });
    await repositories.products.create(product);

    const offer = makeOffer({
      product_id: product.id,
      cycle_id: cycle.id,
      amount: 500,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        offer_id: offer.id.value,
        amount: 27,
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });
});
