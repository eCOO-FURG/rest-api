// Factories
import { makeCategoryAndOffers } from "@/test/factories/make-category-and-offers";

// Use Cases
import { FetchCategoryUseCase } from "@/core/use-cases/fetch-category";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Factories
import { makeCycle } from "@/test/factories/make-cycle";

let categoriesRepository: InMemoryCategoriesRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: FetchCategoryUseCase;

describe("fetch category", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    sut = new FetchCategoryUseCase(categoriesRepository, cyclesRepository);
  });

  it("should be able to fetch a category", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const category = makeCategoryAndOffers();
    await categoriesRepository.create(category);

    const { category: fetchedCategory } = await sut.execute({
      id: category.id.value,
      page: 1,
      cycle_id: cycle.id.value,
    });

    expect(fetchedCategory.id).toEqual(category.id);
    expect(fetchedCategory.name).toEqual(category.name);
    expect(fetchedCategory.offers).toEqual(category.offers);
  });

  it("should not be able to fetch a non-existent category ", async () => {
    await expect(() =>
      sut.execute({
        id: "non-existent-id",
        page: 1,
        cycle_id: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to fetch a category with a non-existent cycle", async () => {
    const category = makeCategoryAndOffers();
    await categoriesRepository.create(category);

    await expect(() =>
      sut.execute({
        id: category.id.value,
        page: 1,
        cycle_id: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
