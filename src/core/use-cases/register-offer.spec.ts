// Use-cases
import { RegisterOfferUseCase } from "@/core/use-cases/register-offer";

// Services
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { FarmNotActiveError } from "@/core/errors/farm-not-active";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { MissingFieldError } from "@/core/errors/missing-field";

// Entities
import { Offer } from "@/core/entities/offer";
import { CycleWeek } from "@/core/entities/cycle";
import { makeCatalog } from "@/test/factories/make-catalog";

// Utils
import { today } from "@/core/utils/today";
import { now } from "@/core/utils/now";
import { last } from "@/core/utils/last";

let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let cyclesRepository: InMemoryCyclesRepository;
let offersRepository: InMemoryOffersRepository;

let sut: RegisterOfferUseCase;

describe("offer products", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    farmsRepository = new InMemoryFarmsRepository();
    catalogsRepository = new InMemoryCatalogsRepository();
    offersRepository = new InMemoryOffersRepository();

    sut = new RegisterOfferUseCase(farmsRepository, productsRepository, catalogsRepository, cyclesRepository, offersRepository);
  });

  it("should be able to offer a product", async () => {
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
      expires_at: now(),
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
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to offer products from a closed product", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ archived: true });
    await productsRepository.create(product);

    const farm = makeFarm({ status: "ACTIVE" });
    await farmsRepository.create(farm);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        expires_at: now(),
        amount: 10,
        price: 10,
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
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
        expires_at: now(),

        amount: 10,
        price: 10,
      }),
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
        expires_at: now(),
        amount: 10,
        price: 10,
      }),
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
        expires_at: now(),
        amount: 10,
        price: 10,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to offer the same product twice in the same cycle", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    const user = makeUser();

    const farm = makeFarm({ status: "ACTIVE", admin_id: user.id, admin: user });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({
      farm_id: farm.id,
      cycle_id: cycle.id,
    });

    const offer = Offer.create({
      catalog_id: catalog.id,
      product_id: product.id,
      product,
      amount: 20,
      price: 30,
      fee: 10,
      closes_at: last(cycle.offer, cycle.inverted()),
    });

    catalog.offers.push(offer);
    offersRepository.items.push(offer);
    await catalogsRepository.create(catalog);

    await expect(() =>
      sut.execute({
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        farm_id: farm.id.value,
        amount: 10,
        price: 10,
        expires_at: now(),
      }),
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
        expires_at: now(),
      }),
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to offer products off the cycle offering days", async () => {
    const offer = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today());

    const cycle = makeCycle({
      offer: offer as CycleWeek,
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
        expires_at: now(),
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to offer a non perishable product without expires_at", async () => {
    const cycle = makeCycle();
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
        description: "Novo.",
      }),
    ).rejects.toBeInstanceOf(MissingFieldError);
  });
});
