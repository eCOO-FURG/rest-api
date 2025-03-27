// Use-cases
import { ListCatalogsUseCase } from "@/core/use-cases/list-catalogs";

// Repositories
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryCategoriesRepository } from "@/test/repositories/in-memory-categories-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Services
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeCategory } from "@/test/factories/make-category";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let sut: ListCatalogsUseCase;

let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let categoriesRepository: InMemoryCategoriesRepository;

describe("list catalogs", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    catalogsRepository = new InMemoryCatalogsRepository();
    categoriesRepository = new InMemoryCategoriesRepository();

    sut = new ListCatalogsUseCase(
      cyclesRepository,
      catalogsRepository,
      categoriesRepository
    );
  });

  it("should be able to list catalogs", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({
      name: "Potato",
    });

    for (let i = 0; i < 5; i++) {
      const user = makeUser();

      const farm = makeFarm({ admin_id: user.id, admin: user });

      const catalog = makeCatalog({
        farm_id: farm.id,
        cycle_id: cycle.id,
        farm,
        cycle,
      });

      const offer = makeOffer({
        catalog_id: catalog.id,
        product_id: product.id,
        product,
      });

      catalog.offers.push(offer);

      catalogsRepository.items.push(catalog);
    }

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      product: "Pota",
    });

    expect(result.catalogs.length).toBe(5);
  });

  it("should not be able to list catalogs from a cycle that does not exist", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to list catalogs filtered by a product category that does not exist", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        cycle_id: cycle.id.value,
        page: 1,
        category_id: "123",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to list catalogs filtered by a product category", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const category = makeCategory({
      name: "Vegetables",
    });
    categoriesRepository.create(category);

    const otherCategory = makeCategory({
      name: "Fruits",
    });
    categoriesRepository.create(otherCategory);

    const product = makeProduct({
      name: "Potato",
      category_id: category.id,
      category,
    });

    const otherProduct = makeProduct({
      name: "Apple",
      category_id: otherCategory.id,
      category: otherCategory,
    });

    for (let i = 0; i < 5; i++) {
      const user = makeUser();

      const farm = makeFarm({ admin_id: user.id, admin: user });

      const catalog = makeCatalog({
        farm_id: farm.id,
        cycle_id: cycle.id,
        farm,
        cycle,
      });

      const offer = makeOffer({
        catalog_id: catalog.id,
        product_id: product.id,
        product,
      });

      catalog.offers.push(offer);

      catalogsRepository.items.push(catalog);
    }

    for (let i = 0; i < 5; i++) {
      const user = makeUser();

      const farm = makeFarm({ admin_id: user.id, admin: user });

      const catalog = makeCatalog({
        farm_id: farm.id,
        cycle_id: cycle.id,
        farm,
        cycle,
      });

      const offer = makeOffer({
        catalog_id: catalog.id,
        product_id: otherProduct.id,
        product: otherProduct,
      });

      catalog.offers.push(offer);

      catalogsRepository.items.push(catalog);
    }

    const result = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      category_id: category.id.value,
    });

    console.log(result.catalogs);

    expect(result.catalogs.length).toBe(5);
    expect(result.catalogs[0].offers[0].product!.category_id).toEqual(
      category.id
    );
  });
});
