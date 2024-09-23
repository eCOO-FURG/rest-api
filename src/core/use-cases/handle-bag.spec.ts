// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Use-cases
import { HandleBagUseCase } from "@/core/use-cases/handle-bag";

// Services
import { makeBag } from "@/test/factories/make-bag";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let farmsRepository: InMemoryFarmsRepository;

let repositories: {
  bags: InMemoryBagsRepository;
  users: InMemoryUsersRepository;
};

let sut: HandleBagUseCase;

describe("handle bag", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);

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

    repositories = {
      bags: new InMemoryBagsRepository(usersRepository, ordersRepository),
      users: new InMemoryUsersRepository(),
    };

    sut = new HandleBagUseCase(repositories.bags);
  });

  it("should be able to handle a bag", async () => {
    const bag = makeBag({ status: "PENDING" });
    await repositories.bags.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      status: "SEPARATED",
    });

    expect(repositories.bags.items[0].status).toEqual("SEPARATED");
  });

  it("should not be able to handle a bag that does not exist", async () => {
    await expect(
      sut.execute({
        bag_id: "invalid-id",
        status: "SEPARATED",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
