// Job
import { PublishCycleOnMarketJob } from "@/core/jobs/publish-cycle-on-market";

// Repositories
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Factories
import { makeOffer } from "@/test/factories/make-offer";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeMarket } from "@/test/factories/make-market";

let offersRepository: InMemoryOffersRepository;
let sut: PublishCycleOnMarketJob;

describe("publish cycle on market job", () => {
  beforeEach(() => {
    offersRepository = new InMemoryOffersRepository();
    sut = new PublishCycleOnMarketJob(offersRepository);
  });

  it("should publish all offers from a cycle to a market", async () => {
    const cycle = makeCycle();
    const market = makeMarket({ open: true });

    const offer1 = makeOffer({
      cycle_id: cycle.id,
      market_id: null,
    });

    const offer2 = makeOffer({
      cycle_id: cycle.id,
      market_id: null,
    });

    const offer3 = makeOffer({
      cycle_id: null,
      market_id: null,
    });

    offersRepository.items.push(offer1, offer2, offer3);

    await sut.execute({
      cycle_id: cycle.id.value,
      market_id: market.id.value,
    });

    expect(offersRepository.items[0].market_id).toEqual(market.id);
    expect(offersRepository.items[1].market_id).toEqual(market.id);
    expect(offersRepository.items[2].market_id).toBeNull();
  });
});
