// Entities
import { Bag } from "@/core/entities/bag";

// Use-cases
import { ListCurrentBagsUseCase } from "@/core/use-cases/list-current-bags";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let cyclesRepository: InMemoryCyclesRepository;
let bagsRepository: InMemoryBagsRepository;

let sut: ListCurrentBagsUseCase;

describe("list bags", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    bagsRepository = new InMemoryBagsRepository();

    sut = new ListCurrentBagsUseCase(cyclesRepository, bagsRepository);
  });

  it("should be list bags from a cycle", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const user = makeUser({ first_name: "José" });

    const bag = makeBag({
      cycle_id: cycle.id,
      customer_id: user.id,
      customer: user,
    });
    bagsRepository.items.push(bag);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      user: user.first_name,
      page: 1,
    });

    expect(result.bags[0]).toBeInstanceOf(Bag);
  });

  it("should not be able to list bags from a cycle that does not exists", async () => {
    const user = makeUser();

    const bag = makeBag({ customer_id: user.id });
    bagsRepository.items.push(bag);

    await expect(() =>
      sut.execute({
        cycle_id: "1234",
        user: user.first_name,
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
