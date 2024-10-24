// Use-cases
import { OpenPaymentUseCase } from "@/core/use-cases/open-payment";

// Providers
// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";

// Services
import { MockedPixProvider } from "@/test/payment/mocked-pix-provider";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeBag } from "@/test/factories/make-bag";
import { makePayment } from "@/test/factories/make-payment";

let usersRepository: InMemoryUsersRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let addressesRepository: InMemoryAddressesRepository;
let bagsRepository: InMemoryBagsRepository;
let productsRepository: InMemoryProductsRepository;
let paymentsRepository: InMemoryPaymentsRepository;

let repositories: {
  bags: InMemoryBagsRepository;
  payments: InMemoryPaymentsRepository;
};

let mocks: {
  pixProvider: MockedPixProvider;
};

let sut: OpenPaymentUseCase;

describe("open payment", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      catalogsRepository
    );
    addressesRepository = new InMemoryAddressesRepository();
    ordersRepository = new InMemoryOrdersRepository(offersRepository);
    productsRepository = new InMemoryProductsRepository();

    paymentsRepository = new InMemoryPaymentsRepository();

    bagsRepository = new InMemoryBagsRepository(
      usersRepository,
      ordersRepository,
      addressesRepository,
      paymentsRepository
    );

    paymentsRepository.setBagsRepository(bagsRepository);

    repositories = {
      bags: bagsRepository,
      payments: paymentsRepository,
    };

    mocks = {
      pixProvider: new MockedPixProvider(),
    };

    sut = new OpenPaymentUseCase(
      repositories.bags,
      repositories.payments,
      mocks.pixProvider
    );
  });

  it("be able to open a payment", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const bag = makeBag({ user_id: user.id });
    repositories.bags.create(bag);

    await sut.execute({ bag_id: bag.id.value });
  });

  it("should not be able to open a payment from a non existing bag", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    await expect(() => sut.execute({ bag_id: "1234" })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });

  it("should not be able to open a payment from a paid bag", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const bag = makeBag({ user_id: user.id });
    repositories.bags.create(bag);

    const payment = makePayment({ bag_id: bag.id, status: "DONE" });
    repositories.payments.create(payment);

    await expect(() =>
      sut.execute({ bag_id: bag.id.value })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to open a payment for a bag with an open payment", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const bag = makeBag({ user_id: user.id });
    repositories.bags.create(bag);

    const payment = makePayment({ bag_id: bag.id, status: "PENDING" });
    repositories.payments.create(payment);

    await expect(() =>
      sut.execute({ bag_id: bag.id.value })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
