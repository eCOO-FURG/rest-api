// Use-cases
import { ListUserBagsUseCase } from "@/core/use-cases/list-user-bags";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";
import { BagMerge } from "../entities/merged/bag-merge";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let farmsRepository: InMemoryFarmsRepository;
let addressesRepository: InMemoryAddressesRepository;

let repositories: {
  // cycles: InMemoryCyclesRepository;
  bags: InMemoryBagsRepository;
};

let sut: ListUserBagsUseCase;

describe("list user bags", () => {
  beforeEach(() => {
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

    repositories = {
      // cycles: new InMemoryCyclesRepository(),
      bags: new InMemoryBagsRepository(
        usersRepository,
        ordersRepository,
        addressesRepository
      ),
    };

    sut = new ListUserBagsUseCase(repositories.bags, usersRepository);
  });

  it("should return a list of bags from an user", async () => {
    const user = makeUser();
    usersRepository.create(user);

    const bag = makeBag({ user_id: user.id, created_at: new Date() });
    await repositories.bags.create(bag);

    const bag2 = makeBag({
      user_id: user.id,
      created_at: new Date(new Date().setDate(new Date().getDate() + 1)),
    });
    await repositories.bags.create(bag2);

    const result = await sut.execute({
      user_id: user.id.value,
      date: "05-10-2024",
      page: 1,
    });

    expect(result.bags[0]).toBeInstanceOf(BagMerge);
  });

  it("should not be able to list bags from a non-existing user", async () => {
    const bag = makeBag();
    await repositories.bags.create(bag);

    await expect(() =>
      sut.execute({
        user_id: "1234",
        date: "05-10-2024",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
