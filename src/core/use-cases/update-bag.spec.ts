// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { UpdateBagUseCase } from "@/core/use-cases/update-bag";

// Services
import { makeBag } from "@/test/factories/make-bag";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";

let usersRepository: InMemoryUsersRepository;
let bagsRepository: InMemoryBagsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: UpdateBagUseCase;

describe("update bag", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bagsRepository = new InMemoryBagsRepository();
    cyclesRepository = new InMemoryCyclesRepository();

    sut = new UpdateBagUseCase(
      bagsRepository,
      usersRepository,
      cyclesRepository
    );
  });

  it("should be able to update a bag", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const bag = makeBag({ status: "PENDING", cycle_id: cycle.id });

    await bagsRepository.create(bag);

    await sut.execute({
      bag_id: bag.id.value,
      user_id: bag.user_id.value,
      status: "SEPARATED",
    });

    expect(bagsRepository.items[0].status).toEqual("SEPARATED");
  });

  it("should not be able to handle a bag that does not exist", async () => {
    await expect(
      sut.execute({
        bag_id: "invalid-id",
        user_id: "invalid-id",
        status: "SEPARATED",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
