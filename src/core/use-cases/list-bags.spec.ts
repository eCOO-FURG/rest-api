// Use-cases
import { ListBagsUseCase } from "@/core/use-cases/list-bags";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Entities
import { BagAggregate } from "@/core/entities/value-objects/bag-aggregate";

// Factories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { makeBag } from "@/test/factories/make-bag";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeUser } from "@/test/factories/make-user";
import { ResourceNotFoundError } from "../errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;

let repositories: {
  cycles: InMemoryCyclesRepository;
  bags: InMemoryBagsRepository;
};

let sut: ListBagsUseCase;

describe("list bags", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    repositories = {
      cycles: new InMemoryCyclesRepository(),
      bags: new InMemoryBagsRepository(usersRepository),
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

    expect(result.bags[0]).toBeInstanceOf(BagAggregate);
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
