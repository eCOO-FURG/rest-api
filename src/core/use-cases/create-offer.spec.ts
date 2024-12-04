// Use-cases
import { CreateOfferUseCase } from "@/core/use-cases/create-offer";

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
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Entities
import { Offer } from "@/core/entities/offer";
import { Week } from "@/core/entities/cycle";
import { makeCatalog } from "@/test/factories/make-catalog";

let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: CreateOfferUseCase;

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

    sut = new CreateOfferUseCase(
      farmsRepository,
      productsRepository,
      catalogsRepository,
      offersRepository,
      cyclesRepository
    );
  });

  it("should be able to offer products", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

    await sut.execute({
      product_id: product.id.value,
      cycle_id: cycle.id.value,
      farm_id: farm.id.value,
      amount: 10,
      price: 10,
      description: "Novo.",
    });

    expect(catalogsRepository.items.length).toBe(1);
    expect(catalogsRepository.items[0].offers.length).toBe(1);
  });

  it("should not be able to offer products from a nonexistent farm", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

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
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    const farm = makeFarm({ status: "INACTIVE" });
    await farmsRepository.create(farm);

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
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

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
    await productsRepository.create(product);

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

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
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
    await catalogsRepository.create(catalog);

    const offer = Offer.create({
      catalog_id: catalog.id,
      product_id: product.id,
      amount: 20,
      price: 30,
    });
    await offersRepository.create(offer);

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
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ pricing: "WEIGHT" });
    await productsRepository.create(product);

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

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

    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
      })
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });
});
