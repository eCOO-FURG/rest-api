// Entities
import { Bag } from "@/core/entities/bag";

// Use-cases
import { ListBagsUseCase } from "@/core/use-cases/list-bags";

// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let farmsRepository: InMemoryFarmsRepository;
let addressesRepository: InMemoryAddressesRepository;
let paymentsRepository: InMemoryPaymentsRepository;
let bagsRepository: InMemoryBagsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: ListBagsUseCase;

describe("list user bags", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      catalogsRepository
    );

    catalogsRepository = new InMemoryCatalogsRepository(
      farmsRepository,
      offersRepository
    );

    offersRepository.inMemoryCatalogsRepository = catalogsRepository;
    ordersRepository = new InMemoryOrdersRepository(offersRepository);
    addressesRepository = new InMemoryAddressesRepository();
    paymentsRepository = new InMemoryPaymentsRepository();
    bagsRepository = new InMemoryBagsRepository(
      usersRepository,
      ordersRepository,
      addressesRepository,
      paymentsRepository
    );

    sut = new ListBagsUseCase(
      bagsRepository,
      usersRepository,
      cyclesRepository
    );
  });

  it("should return a list of bags from an user", async () => {
    const user = makeUser();
    usersRepository.create(user);

    const bag = makeBag({ user_id: user.id, created_at: new Date() });
    await bagsRepository.create(bag);

    const bag2 = makeBag({
      user_id: user.id,
      created_at: new Date(new Date().setDate(new Date().getDate() + 1)),
    });
    await bagsRepository.create(bag2);

    const result = await sut.execute({
      user_id: user.id.value,
      since: new Date("2024-10-05"),
      page: 1,
    });

    expect(result.bags[0]).toBeInstanceOf(Bag);
  });

  it("should not be able to list bags from a non-existing user", async () => {
    const bag = makeBag();
    await bagsRepository.create(bag);

    await expect(() =>
      sut.execute({
        user_id: "1234",
        since: new Date("2024-10-05"),
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("should return only bags within the specified date range", async () => {
    const user = makeUser();
    usersRepository.create(user);

    const bagWithinRange = makeBag({
      user_id: user.id,
      created_at: new Date("2024-10-06"),
    });
    await bagsRepository.create(bagWithinRange);

    const bagOutsideRange = makeBag({
      user_id: user.id,
      created_at: new Date("2024-10-04"),
    });
    await bagsRepository.create(bagOutsideRange);

    const result = await sut.execute({
      user_id: user.id.value,
      since: new Date("2024-10-05"),
      before: new Date("2024-10-07"),
      page: 1,
    });

    expect(result.bags).toHaveLength(1);
    expect(result.bags[0]).toBeInstanceOf(Bag);
    expect(result.bags[0].created_at).toEqual(new Date("2024-10-06"));
  });
});
