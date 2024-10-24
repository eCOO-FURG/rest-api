// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Use-cases
import { RegisterPaymentUseCase } from "@/core/use-cases/register-payment";

// Services
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists";

let paymentsRepository: InMemoryPaymentsRepository;
let usersRepository: InMemoryUsersRepository;
let ordersRepository: InMemoryOrdersRepository;
let addressesRepository: InMemoryAddressesRepository;
let offersRepository: InMemoryOffersRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let bagsRepository: InMemoryBagsRepository;
let productsRepository: InMemoryProductsRepository;
let farmsRepository: InMemoryFarmsRepository;
let sut: RegisterPaymentUseCase;

describe("Register payment", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);
    productsRepository = new InMemoryProductsRepository();
    catalogsRepository = new InMemoryCatalogsRepository(
      farmsRepository,
      offersRepository
    );
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      catalogsRepository
    );
    ordersRepository = new InMemoryOrdersRepository(offersRepository);
    addressesRepository = new InMemoryAddressesRepository();
    paymentsRepository = new InMemoryPaymentsRepository();
    bagsRepository = new InMemoryBagsRepository(
      usersRepository,
      ordersRepository,
      addressesRepository,
      paymentsRepository
    );

    sut = new RegisterPaymentUseCase(bagsRepository, paymentsRepository);
  });

  it("should be able to register a payment", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const bag = makeBag({ user_id: user.id });
    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      method: "CREDIT",
      status: "PENDING",
    });
  });

  it("should not be able to register a payment with a non-existent bag", async () => {
    await expect(() =>
      sut.execute({
        bag_id: "non-existent-bag-id",
        method: "CREDIT",
        status: "PENDING",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to register a payment with a bag that is already paid", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const bag = makeBag({ user_id: user.id });
    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      method: "CREDIT",
      status: "DONE",
    });

    await expect(() =>
      sut.execute({
        bag_id: bag.id.value,
        method: "CREDIT",
        status: "PENDING",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
