// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeMarket } from "@/test/factories/make-market";
import { makeProducer } from "@/test/factories/make-producer";
import { makeOrder } from "@/test/factories/make-order";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { today } from "@/core/utils/today";

let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let marketsRepository: InMemoryMarketsRepository;
let userRepository: InMemoryUsersRepository;

let sut: DeleteOfferUseCase;

describe("delete offer", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    offersRepository = new InMemoryOffersRepository();
    ordersRepository = new InMemoryOrdersRepository();
    marketsRepository = new InMemoryMarketsRepository();

    sut = new DeleteOfferUseCase(
      userRepository,
      offersRepository,
      ordersRepository,
      cyclesRepository,
      marketsRepository,
    );
  });

  it("should be able to delete an offer from a cycle", async () => {
    const user = makeUser();
    userRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
      farm: makeProducer(farm),
    });

    offersRepository.items.push(offer);

    await sut.execute({ user_id: user.id.value, farm_id: farm.id.value, offer_id: offer.id.value });

    expect(offersRepository.items).toHaveLength(0);
  });

  it("should be able to delete an offer from a market", async () => {
    const user = makeUser();
    userRepository.items.push(user);

    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      market_id: market.id,
      farm: makeProducer(farm),
    });

    offersRepository.items.push(offer);

    await sut.execute({ user_id: user.id.value, farm_id: farm.id.value, offer_id: offer.id.value });

    expect(offersRepository.items).toHaveLength(0);
  });

  it("should deactivate an offer that has associated orders", async () => {
    const user = makeUser();
    userRepository.items.push(user);

    const farm = makeFarm({ status: "ACTIVE" });
    const offer = makeOffer({
      farm_id: farm.id,
      farm: makeProducer(farm),
    });
    const order = makeOrder({ offer_id: offer.id });

    offersRepository.items.push(offer);
    ordersRepository.items.push(order);

    await sut.execute({
      user_id: user.id.value,
      farm_id: farm.id.value,
      offer_id: offer.id.value,
    });

    expect(offersRepository.items).toHaveLength(1);
    expect(offersRepository.items[0].active).toBe(false);
  });

  it("should not be able to delete an offer from a closed market", async () => {
    const user = makeUser();
    userRepository.items.push(user);

    const market = makeMarket({ open: false });
    marketsRepository.items.push(market);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      market_id: market.id,
      farm: makeProducer(farm),
    });

    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ user_id: user.id.value, farm_id: farm.id.value, offer_id: offer.id.value }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to delete an offer from a closed cycle", async () => {
    const user = makeUser();
    userRepository.items.push(user);

    const days = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today());

    const cycle = makeCycle({
      offer: days as CycleWeek,
    });
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
      farm: makeProducer(farm),
    });

    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ user_id: user.id.value, farm_id: farm.id.value, offer_id: offer.id.value }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to delete an offer from past cycle offering days", async () => {
    const user = makeUser();

    userRepository.items.push(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });

    const offer = makeOffer({
      farm_id: farm.id,
      cycle_id: cycle.id,
      farm: makeProducer(farm),
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    });

    offersRepository.items.push(offer);

    await expect(() =>
      sut.execute({ user_id: user.id.value, farm_id: farm.id.value, offer_id: offer.id.value }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to delete a nonexistent offer", async () => {
    const user = makeUser();
    userRepository.items.push(user);

    const farm = makeFarm({ status: "ACTIVE" });

    await expect(() =>
      sut.execute({ user_id: user.id.value, farm_id: farm.id.value, offer_id: "123" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
