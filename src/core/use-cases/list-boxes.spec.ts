// Use-cases
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";
import { makeOrder } from "@/test/factories/make-order";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeBox } from "@/test/factories/make-box";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { makeUser } from "@/test/factories/make-user";

let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let productsRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;

let sut: ListBoxesUseCase;

let repositories: {
  cycles: InMemoryCyclesRepository;
  boxes: InMemoryBoxesRepository;
};

describe("list farms with orders", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();
    cyclesRepository = new InMemoryCyclesRepository();

    farmsRepository = new InMemoryFarmsRepository(usersRepository);

    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      catalogsRepository
    );

    catalogsRepository = new InMemoryCatalogsRepository(
      farmsRepository,
      offersRepository
    );

    offersRepository.inMemoryCatalogsRepository = catalogsRepository;

    ordersRepository = new InMemoryOrdersRepository(offersRepository);

    repositories = {
      cycles: cyclesRepository,
      boxes: new InMemoryBoxesRepository(catalogsRepository, ordersRepository),
    };

    sut = new ListBoxesUseCase(repositories.cycles, repositories.boxes);
  });

  it("should not be able to list farms with orders from a cycle that does not exists", async () => {
    await expect(() =>
      sut.execute({
        cycle_id: "123",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to cycle boxes", async () => {
    const admin = makeUser();
    await usersRepository.create(admin);

    const farm = makeFarm({ admin_id: admin.id, name: "Fazenda 1" });
    await farmsRepository.create(farm);

    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
    await catalogsRepository.create(catalog);

    const box = makeBox({ catalog_id: catalog.id });
    await repositories.boxes.create(box);

    const product = makeProduct();
    await productsRepository.create(product);

    const offer = makeOffer({ catalog_id: catalog.id, product_id: product.id });
    await offersRepository.create(offer);

    const order = makeOrder({ offer_id: offer.id });

    await ordersRepository.createMany([order]);

    const { boxes } = await sut.execute({ cycle_id: cycle.id.value, page: 1 });

    expect(boxes).toHaveLength(1);
  });

  it("should be able to search boxes by farm name", async () => {
    const admin = makeUser();
    await usersRepository.create(admin);

    const farm = makeFarm({ admin_id: admin.id, name: "Fazenda 1" });
    await farmsRepository.create(farm);

    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
    await catalogsRepository.create(catalog);

    const box = makeBox({ catalog_id: catalog.id });
    await repositories.boxes.create(box);

    const product = makeProduct();
    await productsRepository.create(product);

    const offer = makeOffer({ catalog_id: catalog.id, product_id: product.id });
    await offersRepository.create(offer);

    const order = makeOrder({ offer_id: offer.id });
    await ordersRepository.createMany([order]);

    const { boxes } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      name: "Fazenda",
    });

    expect(boxes).toHaveLength(1);
  });

  it("should be able to list paginated cycle boxes", async () => {
    const cycle = makeCycle();
    repositories.cycles.items.push(cycle);

    const product = makeProduct();
    await productsRepository.create(product);

    for (let i = 1; i <= 22; i++) {
      const admin = makeUser();
      await usersRepository.create(admin);

      const farm = makeFarm({
        name: `Fazenda ${i}`,
        admin_id: admin.id,
      });
      await farmsRepository.create(farm);

      const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });
      await catalogsRepository.create(catalog);

      const box = makeBox({ catalog_id: catalog.id });
      await repositories.boxes.create(box);

      const offer = makeOffer({
        product_id: product.id,
      });
      await offersRepository.create(offer);

      const order = makeOrder({
        offer_id: offer.id,
      });
      await ordersRepository.createMany([order]);
    }

    const { boxes } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 2,
    });

    expect(boxes).toHaveLength(2);
  });
});
