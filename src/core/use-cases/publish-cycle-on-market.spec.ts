// Use-case
import { PublishCycleOnMarketUseCase } from "@/core/use-cases/publish-cycle-on-market";

// Factories
import { makeMarket } from "@/test/factories/make-market";
import { makeCycle } from "@/test/factories/make-cycle";

// Repositories
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Jobs
import { MockedScheduler } from "@/test/jobs/mocked-scheduler";

let marketsRepository: InMemoryMarketsRepository;
let cyclesRepository: InMemoryCyclesRepository;
let scheduler: MockedScheduler;

let sut: PublishCycleOnMarketUseCase;

describe("publish cycle on market", () => {
  beforeEach(() => {
    marketsRepository = new InMemoryMarketsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    scheduler = new MockedScheduler();
    sut = new PublishCycleOnMarketUseCase(marketsRepository, cyclesRepository, scheduler);
  });

  it("should not be able to publish when market does not exist", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({ market_id: "nonexistent-market-id", cycle_id: cycle.id.value }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to publish when cycle does not exist", async () => {
    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    await expect(() =>
      sut.execute({ market_id: market.id.value, cycle_id: "nonexistent-cycle-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to publish when market is closed", async () => {
    const market = makeMarket({ open: false });
    marketsRepository.items.push(market);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({ market_id: market.id.value, cycle_id: cycle.id.value }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should schedule the publishing of all offers of the cycle to the given market", async () => {
    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await sut.execute({ market_id: market.id.value, cycle_id: cycle.id.value });

    expect(scheduler.jobs).toHaveLength(1);
  });
});
