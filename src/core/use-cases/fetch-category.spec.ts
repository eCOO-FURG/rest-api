// Factories
import { makeCategoryAndOffers } from "@/test/factories/make-category-and-offers";

// Use Cases
import { FetchCategoryUseCase } from "@/core/use-cases/fetch-category";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";

let categoriesRepository: InMemoryCategoriesRepository;

let sut: FetchCategoryUseCase;

describe("fetch category", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchCategoryUseCase(categoriesRepository);
  });

  it("should be able to fetch a category", async () => {
    const category = makeCategoryAndOffers();
    await categoriesRepository.create(category);

    const { category: fetchedCategory } = await sut.execute({
      id: category.id.value,
    });

    expect(fetchedCategory.id).toEqual(category.id);
    expect(fetchedCategory.name).toEqual(category.name);
    expect(fetchedCategory.offers).toEqual(category.offers);
  });

  it("should not be able to fetch a non-existent category ", async () => {
    await expect(() =>
      sut.execute({
        id: "non-existent-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
