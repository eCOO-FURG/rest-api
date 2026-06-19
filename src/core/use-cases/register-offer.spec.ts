// Use-cases
import { RegisterOfferUseCase } from "@/core/use-cases/register-offer";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeMarket } from "@/test/factories/make-market";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Errors
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { MissingFieldError } from "@/core/errors/missing-field";
import { ResourceClosedError } from "@/core/errors/resource-closed";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Entities
import { CycleWeek } from "@/core/entities/cycle";

// Utils
import { today } from "@/core/utils/today";

let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;
let cyclesRepository: InMemoryCyclesRepository;
let marketsRepository: InMemoryMarketsRepository;
let offersRepository: InMemoryOffersRepository;

let sut: RegisterOfferUseCase;

describe("register offer", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    productsRepository = new InMemoryProductsRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    marketsRepository = new InMemoryMarketsRepository();
    offersRepository = new InMemoryOffersRepository();

    sut = new RegisterOfferUseCase(
      farmsRepository,
      productsRepository,
      cyclesRepository,
      marketsRepository,
      offersRepository,
    );
  });

  it("should be able to create an offer for a cycle", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: true });
    productsRepository.items.push(product);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await sut.execute({
      farm_id: farm.id.value,
      product_id: product.id.value,
      cycle_id: cycle.id.value,
      market_id: "",
      amount: 10,
      price: 100,
      description: "offer description",
      comment: "offer comment",
    });

    expect(offersRepository.items).toHaveLength(1);
    expect(offersRepository.items[0]).toEqual(
      expect.objectContaining({
        farm_id: farm.id,
        product_id: product.id,
        cycle_id: cycle.id,
        amount: 10,
        price: 100,
        description: "offer description",
        comment: "offer comment",
      }),
    );
  });

  it("should be able to create an offer for a market", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: false });
    productsRepository.items.push(product);

    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    await sut.execute({
      farm_id: farm.id.value,
      product_id: product.id.value,
      cycle_id: "",
      market_id: market.id.value,
      amount: 10,
      price: 100,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    expect(offersRepository.items).toHaveLength(1);
    expect(offersRepository.items[0]).toEqual(
      expect.objectContaining({
        farm_id: farm.id,
        product_id: product.id,
        market_id: market.id,
        amount: 10,
        price: 100,
      }),
    );
  });

  it("should not be able to create an offer for a nonexistent farm", async () => {
    const product = makeProduct();
    productsRepository.items.push(product);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: "nonexistent-farm-id",
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        market_id: "",
        amount: 10,
        price: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an offer for a nonexistent product", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: "nonexistent-product-id",
        cycle_id: cycle.id.value,
        market_id: "",
        amount: 10,
        price: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an offer for a non-perishable product without expiration date", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: false });
    productsRepository.items.push(product);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        market_id: "",
        amount: 10,
        price: 100,
      }),
    ).rejects.toBeInstanceOf(MissingFieldError);
  });

  it("should not be able to create an offer for an archived product", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ archived: true, perishable: true });
    productsRepository.items.push(product);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        market_id: "",
        amount: 10,
        price: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to create an offer for a weight-priced product with invalid amount", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ pricing: "WEIGHT", perishable: true });
    productsRepository.items.push(product);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        market_id: "",
        amount: 150, // Not a multiple of 100
        price: 100,
      }),
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });

  it("should not be able to create an offer for a nonexistent market", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: false });
    productsRepository.items.push(product);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: "",
        market_id: "nonexistent-market-id",
        amount: 10,
        price: 100,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an offer for a closed market", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: false });
    productsRepository.items.push(product);

    const market = makeMarket({ open: false });
    marketsRepository.items.push(market);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: "",
        market_id: market.id.value,
        amount: 10,
        price: 100,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to create a duplicate offer for a market", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: false });
    productsRepository.items.push(product);

    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    // Create first offer
    const existingOffer = makeOffer({
      farm_id: farm.id,
      product_id: product.id,
      market_id: market.id,
    });
    offersRepository.items.push(existingOffer);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: "",
        market_id: market.id.value,
        amount: 10,
        price: 100,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should reactivate and update a disabled offer for a market", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: false });
    productsRepository.items.push(product);

    const market = makeMarket({ open: true });
    marketsRepository.items.push(market);

    const existingOffer = makeOffer({
      farm_id: farm.id,
      product_id: product.id,
      market_id: market.id,
      active: false,
      amount: 1,
      price: 10,
    });
    offersRepository.items.push(existingOffer);

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await sut.execute({
      farm_id: farm.id.value,
      product_id: product.id.value,
      market_id: market.id.value,
      amount: 20,
      price: 50,
      description: "updated description",
      expires_at: expiresAt,
    });

    expect(offersRepository.items).toHaveLength(1);
    expect(offersRepository.items[0]).toEqual(
      expect.objectContaining({
        id: existingOffer.id,
        active: true,
        amount: 20,
        price: 50,
        description: "updated description",
        expires_at: expiresAt,
      }),
    );
    expect(offersRepository.items[0].updated_at).not.toBeNull();
  });

  it("should not be able to create an offer for a nonexistent cycle", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: true });
    productsRepository.items.push(product);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: "nonexistent-cycle-id",
        market_id: "",
        amount: 10,
        price: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an offer for a cycle outside offering period", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: true });
    productsRepository.items.push(product);

    const days = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today());

    const cycle = makeCycle({
      offer: days as CycleWeek,
    });
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        market_id: "",
        amount: 10,
        price: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able to create a duplicate offer for a cycle", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: true });
    productsRepository.items.push(product);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    // Create first offer
    const existingOffer = makeOffer({
      farm_id: farm.id,
      product_id: product.id,
      cycle_id: cycle.id,
    });
    offersRepository.items.push(existingOffer);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        product_id: product.id.value,
        cycle_id: cycle.id.value,
        market_id: "",
        amount: 10,
        price: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should reactivate and update a disabled recurring offer for a cycle", async () => {
    const farm = makeFarm({ status: "ACTIVE" });
    farmsRepository.items.push(farm);

    const product = makeProduct({ perishable: true });
    productsRepository.items.push(product);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const existingOffer = makeOffer({
      farm_id: farm.id,
      product_id: product.id,
      cycle_id: cycle.id,
      active: false,
      closes_at: null,
      amount: 1,
      price: 10,
    });
    offersRepository.items.push(existingOffer);

    await sut.execute({
      farm_id: farm.id.value,
      product_id: product.id.value,
      cycle_id: cycle.id.value,
      amount: 30,
      price: 75,
      description: "reactivated offer",
      comment: "updated comment",
      recurring: true,
    });

    expect(offersRepository.items).toHaveLength(1);
    expect(offersRepository.items[0]).toEqual(
      expect.objectContaining({
        id: existingOffer.id,
        active: true,
        amount: 30,
        price: 75,
        description: "reactivated offer",
        comment: "updated comment",
        closes_at: null,
      }),
    );
    expect(offersRepository.items[0].updated_at).not.toBeNull();
  });
});
