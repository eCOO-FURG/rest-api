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
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { InvalidWeightError } from "@/core/errors/invalid-weight";

// Entities
import { Offer } from "@/core/entities/offer";
import { Week } from "@/core/entities/cycle";
import { ClosedActionError } from "@/core/errors/closed-action";
import { makeCatalog } from "@/test/factories/make-catalog";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let repositories: {
  farms: InMemoryFarmsRepository;
  products: InMemoryProductsRepository;
  catalogs: InMemoryCatalogsRepository;
  offers: InMemoryOffersRepository;
  cycles: InMemoryCyclesRepository;
};

let sut: OfferProductsUseCase;

describe("offer products", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      catalogsRepository
    );

    catalogsRepository = new InMemoryCatalogsRepository(
      farmsRepository,
      offersRepository
    );

    offersRepository.inMemoryCatalogsRepository = catalogsRepository;
    farmsRepository = new InMemoryFarmsRepository(usersRepository);

    repositories = {
      farms: farmsRepository,
      catalogs: new InMemoryCatalogsRepository(
        farmsRepository,
        offersRepository
      ),
      products: productsRepository,
      cycles: cyclesRepository,
      offers: offersRepository,
    };

    sut = new OfferProductsUseCase(
      repositories.farms,
      repositories.products,
      repositories.catalogs,
      repositories.offers,
      repositories.cycles
    );
  });

  it("should be able to offer products", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

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
    expect(repositories.catalogs.items.length).toBe(1);
    expect(
      repositories.catalogs.items[0].id.equals(
        repositories.offers.items[0].catalog_id
      )
    ).toBe(true);
  });

  it("should not be able to offer products from a nonexistent farm", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: "123",
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to offer products from a not active farm", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const farm = makeFarm({ active: false });
    await repositories.farms.create(farm);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(FarmNotActiveError);
  });

  it("should not be able to offer nonexistent products", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const farm = makeFarm();
    await repositories.farms.create(farm);

    await expect(() =>
      sut.execute({
        product_id: "123",
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to offer products in a nonexistent cycle", async () => {
    const product = makeProduct();
    await repositories.products.create(product);

    const farm = makeFarm();
    await repositories.farms.create(farm);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: "123",
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to offer the same product twice in the same cycle", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const farm = makeFarm();
    await repositories.farms.create(farm);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
    await repositories.catalogs.create(catalog);

    const offer = Offer.create({
      catalog_id: catalog.id,
      product_id: product.id,
      amount: 20,
      price: 30,
    });
    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to offer products with invalid weight", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct({ pricing: "WEIGHT" });
    await repositories.products.create(product);

    const farm = makeFarm();
    await repositories.farms.create(farm);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to offer products off the cycle offering days", async () => {
    const today = (new Date().getDay() + 1) as Week[0];

    const offer = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today);

    const cycle = makeCycle({
      offer: offer as Week,
    });

    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const farm = makeFarm();
    await repositories.farms.create(farm);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(ClosedActionError);
  });
});
