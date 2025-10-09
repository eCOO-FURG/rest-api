// Use-cases
import { RegisterOrderUseCase } from "@/core/use-cases/register-order";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeMarket } from "@/test/factories/make-market";
import { makeUser } from "@/test/factories/make-user";
import { makeOffer } from "@/test/factories/make-offer";
import { makeBag } from "@/test/factories/make-bag";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";

// Errors
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";

// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { today } from "@/core/utils/today";

// Test utilities
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { makeOfferAndDetails } from "@/test/factories/make-offer-and-details";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let marketsRepository: InMemoryMarketsRepository;
let offersRepository: InMemoryOffersRepository;
let bagsRepository: InMemoryBagsRepository;
let boxesRepository: InMemoryBoxesRepository;
let addressesRepository: InMemoryAddressesRepository;
let mailer: MockedMailer;

let sut: RegisterOrderUseCase;

describe("register order", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    marketsRepository = new InMemoryMarketsRepository();
    offersRepository = new InMemoryOffersRepository();
    bagsRepository = new InMemoryBagsRepository();
    boxesRepository = new InMemoryBoxesRepository();
    addressesRepository = new InMemoryAddressesRepository();
    mailer = new MockedMailer();

    sut = new RegisterOrderUseCase(
      usersRepository,
      cyclesRepository,
      marketsRepository,
      offersRepository,
      bagsRepository,
      boxesRepository,
      addressesRepository,
      mailer,
    );
  });

  it("should be able to create an order for a cycle", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const offer = makeOffer({ cycle_id: cycle.id, amount: 100 });
    offersRepository.items.push(makeOfferAndDetails(offer));

    const result = await sut.execute({
      user_id: user.id.value,
      cycle_id: cycle.id.value,
      items: [
        {
          offer_id: offer.id.value,
          amount: 10,
        },
      ],
    });

    expect(result.bag).toBeDefined();
    expect(bagsRepository.items).toHaveLength(1);
    expect(bagsRepository.items[0].orders).toHaveLength(1);
    expect(bagsRepository.items[0].orders[0]).toEqual(
      expect.objectContaining({
        offer_id: offer.id,
        amount: 10,
      }),
    );
  });

  it("should be able to create an order for a market", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    const product = makeProduct({ perishable: false });
    const offer = makeOffer({
      market_id: market.id,
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    const result = await sut.execute({
      user_id: user.id.value,
      market_id: market.id.value,
      items: [
        {
          offer_id: offer.id.value,
          amount: 10,
        },
      ],
    });

    expect(result.bag).toBeDefined();
    expect(bagsRepository.items).toHaveLength(1);
    expect(bagsRepository.items[0].orders).toHaveLength(1);
  });

  it("should be able to create an order with address", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      cycle_id: cycle.id,
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    const result = await sut.execute({
      user_id: user.id.value,
      cycle_id: cycle.id.value,
      items: [{ offer_id: offer.id.value, amount: 10 }],
      residence: {
        street: "Rua das Flores",
        number: "123",
        neighborhood: "Centro",
        postal_code: "12345-678",
        complement: "Apto 101",
      },
    });

    expect(result.bag).toBeDefined();
    expect(bagsRepository.items[0].address_id).toBeDefined();
  });

  it("should be able to add items to existing bag", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const bag = makeBag({
      customer_id: user.id,
      cycle_id: cycle.id,
      status: "PENDING",
    });
    bagsRepository.items.push(bag);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      cycle_id: cycle.id,
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await sut.execute({
      user_id: user.id.value,
      cycle_id: cycle.id.value,
      items: [
        {
          offer_id: offer.id.value,
          amount: 10,
        },
      ],
    });

    expect(bagsRepository.items).toHaveLength(1);
    expect(bagsRepository.items[0].orders).toHaveLength(1);
  });

  it("should not be able to create an order for a nonexistent user", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      cycle_id: cycle.id,
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: "nonexistent-user-id",
        cycle_id: cycle.id.value,
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order for a nonexistent cycle", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: "nonexistent-cycle-id",
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order for a closed cycle", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const days = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today());

    const cycle = makeCycle({
      order: days as CycleWeek,
    });
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      cycle_id: cycle.id,
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to create an order for a nonexistent market", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const product = makeProduct({ perishable: false });
    const offer = makeOffer({
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        market_id: "nonexistent-market-id",
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order for a closed market", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const market = makeMarket({ open: false });
    marketsRepository.items.push(market);

    const product = makeProduct({ perishable: false });
    const offer = makeOffer({
      market_id: market.id,
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        market_id: market.id.value,
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to create an order for a nonexistent offer", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        items: [
          {
            offer_id: "nonexistent-offer-id",
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order for an unavailable offer", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      cycle_id: cycle.id,
      amount: 100,
      price: 50,
      product,
      active: false,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to create an order with amount greater than available", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      cycle_id: cycle.id,
      amount: 10, // Available amount
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        items: [
          {
            offer_id: offer.id.value,
            amount: 20, // More than available
          },
        ],
      }),
    ).rejects.toBeInstanceOf(UnavailableAmountError);
  });

  it("should not be able to create an order for weight-priced product with invalid amount", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ pricing: "WEIGHT", perishable: true });
    const offer = makeOffer({
      cycle_id: cycle.id,
      amount: 1000,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        items: [
          {
            offer_id: offer.id.value,
            amount: 150, // Not a multiple of 100
          },
        ],
      }),
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to create an order for offer from different cycle", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const cycle1 = makeCycle();
    const cycle2 = makeCycle();
    cyclesRepository.items.push(cycle1, cycle2);

    const product = makeProduct({ perishable: true });
    const offer = makeOffer({
      cycle_id: cycle2.id, // Offer is from cycle2
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle1.id.value, // But ordering from cycle1
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order for offer from different market", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const market1 = makeMarket({ open: true });
    const market2 = makeMarket({ open: true });
    marketsRepository.items.push(market1, market2);

    const product = makeProduct({ perishable: false });
    const offer = makeOffer({
      market_id: market2.id, // Offer is from market2
      amount: 100,
      price: 50,
      product,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        market_id: market1.id.value, // But ordering from market1
        items: [
          {
            offer_id: offer.id.value,
            amount: 10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
