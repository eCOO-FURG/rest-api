// Use-cases
import { ListOffersUseCase } from "@/core/use-cases/list-offers";

// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryMarketsRepository } from "@/test/repositories/in-memory-markets-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Factories
import { makeCategory } from "@/test/factories/make-category";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Utils
import { now } from "@/core/utils/now";

let cyclesRepository: InMemoryCyclesRepository;
let marketRepository: InMemoryMarketsRepository;
let offersRepository: InMemoryOffersRepository;
let categoriesRepository: InMemoryCategoriesRepository;

let sut: ListOffersUseCase;

describe("list offers", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    offersRepository = new InMemoryOffersRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    marketRepository = new InMemoryMarketsRepository();

    sut = new ListOffersUseCase(
      offersRepository,
      cyclesRepository,
      marketRepository,
      categoriesRepository,
    );
  });

  it("should be able to list available offers", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();

    const availableOffer = makeOffer({
      cycle_id: cycle.id,
      product_id: product.id,
      product,
      closes_at: null,
      expires_at: null,
      active: true,
      amount: 10,
    });

    const unavailableOffer = makeOffer({
      cycle_id: cycle.id,
      product_id: product.id,
      product,
      closes_at: now({
        minus: 30,
      }),
      expires_at: now({
        minus: 30,
      }),
      active: false,
      amount: 0,
    });

    offersRepository.items.push(availableOffer);
    offersRepository.items.push(unavailableOffer);

    const result = await sut.execute({ page: 1, available: "CYCLE" });

    expect(result.offers.length).toBe(1);
    expect(result.offers[0].id).toEqual(availableOffer.id);
  });

  it("should not be able to list offers that are not available", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();

    const closedOffer = makeOffer({
      cycle_id: cycle.id,
      product_id: product.id,
      product,
      closes_at: now(),
      expires_at: now(),
      active: false,
      amount: 0,
    });

    offersRepository.items.push(closedOffer);

    const result = await sut.execute({ page: 1, available: "CYCLE" });

    expect(result.offers.length).toBe(0);
  });

  it("should be able to list available offers from a specific cycle", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const otherCycle = makeCycle();
    cyclesRepository.items.push(otherCycle);

    const product = makeProduct();

    const offer1 = makeOffer({
      cycle_id: cycle.id,
      product_id: product.id,
      product,
      closes_at: null,
      expires_at: null,
      active: true,
      amount: 10,
    });

    const offer2 = makeOffer({
      cycle_id: otherCycle.id,
      product_id: product.id,
      product,
      closes_at: null,
      expires_at: null,
      active: true,
      amount: 10,
    });

    offersRepository.items.push(offer1, offer2);

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
    });

    expect(result.offers.length).toBe(1);
    expect(result.offers[0].cycle_id).toEqual(cycle.id);
  });

  it("should not be able to list available offers from a non-existing cycle", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "non-existing-cycle",
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to list available offers from a specific category", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const category = makeCategory();
    categoriesRepository.items.push(category);

    const otherCategory = makeCategory();
    categoriesRepository.items.push(otherCategory);

    const product1 = makeProduct({ category_id: category.id, category });
    const product2 = makeProduct({
      category_id: otherCategory.id,
      category: otherCategory,
    });

    const offer1 = makeOffer({
      cycle_id: cycle.id,
      product_id: product1.id,
      product: product1,
      closes_at: null,
      expires_at: null,
      active: true,
      amount: 10,
    });

    const offer2 = makeOffer({
      cycle_id: cycle.id,
      product_id: product2.id,
      product: product2,
      closes_at: null,
      expires_at: null,
      active: true,
      amount: 10,
    });

    offersRepository.items.push(offer1, offer2);

    const result = await sut.execute({
      category_id: category.id.value,
      page: 1,
    });

    expect(result.offers.length).toBe(1);
    expect(result.offers[0].product!.category_id).toEqual(category.id);
  });

  it("should not be able to list available offers from a non-existing category", async () => {
    await expect(() =>
      sut.execute({
        category_id: "non-existing-category",
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to list available offers from a specific product", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product1 = makeProduct();
    const product2 = makeProduct();

    const offer1 = makeOffer({
      cycle_id: cycle.id,
      product_id: product1.id,
      product: product1,
      closes_at: null,
      expires_at: null,
      active: true,
      amount: 10,
    });

    const offer2 = makeOffer({
      cycle_id: cycle.id,
      product_id: product2.id,
      product: product2,
      closes_at: null,
      expires_at: null,
      active: true,
      amount: 10,
    });

    offersRepository.items.push(offer1, offer2);

    const result = await sut.execute({
      product: product1.name,
      page: 1,
    });

    expect(result.offers.length).toBe(1);
    expect(result.offers[0].product_id).toEqual(product1.id);
  });

  it("should not be able to list available offers from a non-existing product", async () => {
    const result = await sut.execute({
      product: "non-existing-product",
      page: 1,
    });

    expect(result.offers.length).toBe(0);
  });

  it("should be able to list offers with pagination", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();

    for (let i = 0; i < 25; i++) {
      const offer = makeOffer({
        cycle_id: cycle.id,
        product_id: product.id,
        product,
        closes_at: null,
        expires_at: null,
        active: true,
        amount: 10,
      });
      offersRepository.items.push(offer);
    }

    const resultPage1 = await sut.execute({
      page: 1,
    });

    const resultPage2 = await sut.execute({
      page: 2,
    });

    expect(resultPage1.offers.length).toBe(20);
    expect(resultPage2.offers.length).toBe(5);
  });

  it("should return an empty array if no offers match the criteria", async () => {
    const result = await sut.execute({
      page: 1,
      product: "non-existing-product",
    });

    expect(result.offers.length).toBe(0);
  });
});
