// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

// Use-cases
import { DeleteOfferUseCase } from "@/core/use-cases/delete-offer";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;

let repositories: {
  offers: InMemoryOffersRepository;
  farms: InMemoryFarmsRepository;
};

let sut: DeleteOfferUseCase;

describe("delete offer", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    usersRepository = new InMemoryUsersRepository();
    ordersRepository: new InMemoryOrdersRepository(offersRepository, productsRepository),

    repositories = {
      offers: new InMemoryOffersRepository(
        productsRepository,
        cyclesRepository
      ),
      farms: new InMemoryFarmsRepository(
        usersRepository,
        offersRepository,
        productsRepository,
        ordersRepository
      ),
    };
    sut = new DeleteOfferUseCase(repositories.farms, repositories.offers);
  });

  it("should be able to delete an offer", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const offer = makeOffer({ farm_id: farm.id });
    await repositories.offers.create(offer);

    await sut.execute({
      offer_id: offer.id.value,
      farm_id: farm.id.value,
    });

    expect(repositories.offers.items.length).toBe(0);
  });

  it("should not be able to delete a non-existing offer", async () => {
    await expect(
      sut.execute({
        offer_id: "123",
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from a non-existing farm", async () => {
    const offer = makeOffer();
    await repositories.offers.create(offer);

    await expect(
      sut.execute({
        offer_id: offer.id.value,
        farm_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete an offer from another farm", async () => {
    const farm = makeFarm();
    await repositories.farms.create(farm);

    const farm2 = makeFarm();
    await repositories.farms.create(farm2);

    const offer = makeOffer({ farm_id: farm2.id });
    await repositories.offers.create(offer);

    await expect(
      sut.execute({
        offer_id: offer.id.value,
        farm_id: farm.id.value,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
