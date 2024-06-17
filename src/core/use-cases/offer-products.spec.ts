// Use-cases
import { OfferProductsUseCase } from "@/core/use-cases/offer-products";

// Services
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeProduct } from "@/test/factories/make-product";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

let usersRepository: InMemoryUsersRepository;

let repositories: {
  farms: InMemoryFarmsRepository;
  products: InMemoryProductsRepository;
  offers: InMemoryOffersRepository;
  cycles: InMemoryCyclesRepository;
};

let sut: OfferProductsUseCase;

describe("offer products", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    repositories = {
      farms: new InMemoryFarmsRepository(usersRepository),
      products: new InMemoryProductsRepository(),
      cycles: new InMemoryCyclesRepository(),
      offers: new InMemoryOffersRepository(),
    };

    sut = new OfferProductsUseCase(
      repositories.farms,
      repositories.products,
      repositories.offers,
      repositories.cycles
    );
  });

  it("should be able to offer products", async () => {
    const cycle = makeCycle();
    await repositories.cycles.create(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const farm = makeFarm();
    await repositories.farms.create(farm);

    await sut.execute({
      product_id: product.id.value,
      cycle_id: cycle.id.value,
      farm_id: farm.id.value,
      amount: 10,
      price: 10,
      description: "Novo.",
    });

    expect(repositories.offers.items.length).toBe(1);
  });
});
