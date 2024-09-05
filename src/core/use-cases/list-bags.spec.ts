// Use-cases
import { ListBagsUseCase } from "@/core/use-cases/list-bags";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Entities
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Factories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { makeBag } from "@/test/factories/make-bag";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;

let repositories: {
  cycles: InMemoryCyclesRepository;
  bags: InMemoryBagsRepository;
};

let sut: ListBagsUseCase;

describe("list bags", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(productsRepository);
    ordersRepository = new InMemoryOrdersRepository(offersRepository);

    repositories = {
      cycles: new InMemoryCyclesRepository(),
      bags: new InMemoryBagsRepository(usersRepository, ordersRepository),
    };

    sut = new ListBagsUseCase(repositories.cycles, repositories.bags);
  });

  it("should be list bags from a cycle", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const user = makeUser({ first_name: "José" });
    usersRepository.create(user);

    const bag = makeBag({ cycle_id: cycle.id, user_id: user.id });
    await repositories.bags.create(bag);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      name: user.first_name,
      page: 1,
    });

    expect(result.bags[0]).toBeInstanceOf(BagMerge);
  });

  it("should not be able to list bags from a cycle that does not exists", async () => {
    const user = makeUser();
    usersRepository.create(user);

    const bag = makeBag({ user_id: user.id });
    await repositories.bags.create(bag);

    await expect(() =>
      sut.execute({
        cycle_id: "1234",
        name: user.first_name,
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
