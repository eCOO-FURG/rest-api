// Repositories
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Use-cases
import { ListCategoriesUseCase } from "@/core/use-cases/list-categories";

// Services
import { makeCategory } from "@/test/factories/make-category";

let categoriesRepository: InMemoryCategoriesRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: ListCategoriesUseCase;

describe("list categories", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new ListCategoriesUseCase(cyclesRepository, categoriesRepository);
  });

  it("should be able to list categories", async () => {
    const category1 = makeCategory({
      name: "Fruits",
    });
    categoriesRepository.create(category1);

    const category2 = makeCategory();
    categoriesRepository.create(category2);

    const response = await sut.execute({
      name: "Fruits",
      page: 1,
    });

    expect(response.categories).toHaveLength(1);
  });
});
