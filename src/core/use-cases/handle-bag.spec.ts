// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { HandleBagUseCase } from "@/core/use-cases/handle-bag";

// Services
import { makeBag } from "@/test/factories/make-bag";

// Errors
import { ResourceNotFoundError } from "../errors/resource-not-found";

let repositories: {
  bags: InMemoryBagsRepository;
  users: InMemoryUsersRepository;
};

let sut: HandleBagUseCase;

describe("handle bag", () => {
  beforeEach(() => {
    repositories = {
      bags: new InMemoryBagsRepository(new InMemoryUsersRepository()),
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
