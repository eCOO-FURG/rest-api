// Use-cases
import { UpdateOfferUseCase } from "@/core/use-cases/update-offer";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeMarket } from "@/test/factories/make-market";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";

// Errors
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { today } from "@/core/utils/today";

let offersRepository: InMemoryOffersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let marketsRepository: InMemoryMarketsRepository;

let sut: UpdateOfferUseCase;

describe("update offer", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    marketsRepository = new InMemoryMarketsRepository();
    offersRepository = new InMemoryOffersRepository();

    sut = new UpdateOfferUseCase(offersRepository, cyclesRepository, marketsRepository);
  });

  it("should be able to update an offer from a cycle", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
    });

    offersRepository.items.push(offer);

    await sut.execute({
      farm_id: farm.id.value,
      offer_id: offer.id.value,
      description: "offer description.",
      comment: "offer comment.",
      amount: 10,
      price: 10,
      active: false,
    });

    expect(offersRepository.items[0]).toMatchObject({
      description: "offer description.",
      comment: "offer comment.",
      amount: 10,
      price: 10,
      active: false,
    });
  });

  it("should be able to update an offer from a market", async () => {
    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      market_id: market.id,
    });
    offersRepository.items.push(offer);

    await sut.execute({
      farm_id: farm.id.value,
      offer_id: offer.id.value,
      description: "offer description.",
      comment: "offer comment.",
      amount: 10,
      price: 10,
      active: false,
    });

    expect(offersRepository.items[0]).toMatchObject({
      description: "offer description.",
      comment: "offer comment.",
      amount: 10,
      price: 10,
      active: false,
    });
  });

  it("should not be able to update an offer exclusive from a closed market", async () => {
    const market = makeMarket({ open: false });
    marketsRepository.items.push(market);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      market_id: market.id,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        description: "offer description.",
        comment: "offer comment.",
        amount: 10,
        price: 10,
        active: false,
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should be not be able to update an offer exclusive from a closed cycle", async () => {
    const days = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today());

    const cycle = makeCycle({
      offer: days as CycleWeek,
    });
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        description: "offer description.",
        comment: "offer comment.",
        amount: 10,
        price: 10,
        active: false,
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to updated an offer from past cycle offering days", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    });
    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        offer_id: offer.id.value,
        description: "offer description.",
        comment: "offer comment.",
        amount: 10,
        price: 10,
        active: false,
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to update a nonexistent offer", async () => {
    const farm = makeFarm({ status: "ACTIVE" });

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        offer_id: "123",
        description: "offer description.",
        comment: "offer comment.",
        amount: 10,
        price: 10,
        active: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
