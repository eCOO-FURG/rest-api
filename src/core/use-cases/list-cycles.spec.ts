// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Use-cases
import { ListCyclesUseCase } from "@/core/use-cases/list-cycles";

// Services
import { makeCycle } from "@/test/factories/make-cycle";

let cyclesRepository: InMemoryCyclesRepository;

let sut: ListCyclesUseCase;

describe("list cycles", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();

    sut = new ListCyclesUseCase(cyclesRepository);
  });

  it("should be able to list cycles", async () => {
    const cycle1 = makeCycle();
    cyclesRepository.items.push(cycle1);

    const cycle2 = makeCycle();
    cyclesRepository.items.push(cycle2);

    const response = await sut.execute();

    expect(response.cycles).toHaveLength(2);
  });
});
