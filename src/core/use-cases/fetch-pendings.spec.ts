// Use-cases
import { FetchPendingsUseCase } from "@/core/use-cases/fetch-pendings";

// Repositories
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeUser } from "@/test/factories/make-user";
import { makeBox } from "@/test/factories/make-box";
import { makeCatalog } from "@/test/factories/make-catalog";

// Cache
import { MockedCacheManager } from "@/test/cache/mocked-cache-manager";

let boxesRepository: InMemoryBoxesRepository;
let farmsRepository: InMemoryFarmsRepository;
let cyclesRepository: InMemoryCyclesRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let usersRepository: InMemoryUsersRepository;
let offersRepository: InMemoryOffersRepository;
let productsRepository: InMemoryProductsRepository;

let cacheManager: MockedCacheManager;

let sut: FetchPendingsUseCase;

describe("Fetch pendings", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);
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

    boxesRepository = new InMemoryBoxesRepository(
      catalogsRepository,
      new InMemoryOrdersRepository(offersRepository)
    );

    cacheManager = new MockedCacheManager();

    sut = new FetchPendingsUseCase(
      cyclesRepository,
      farmsRepository,
      boxesRepository,
      cacheManager
    );
  });

  it("should be able to fetch pending farms and boxes in a cycle", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm1 = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm1);

    const farm2 = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm2);

    const farm3 = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm3);

    const farm4 = makeFarm({ admin_id: user.id, status: "ACTIVE" });
    await farmsRepository.create(farm4);

    const box1 = makeBox();
    boxesRepository.items.push(box1);

    const box2 = makeBox();
    boxesRepository.items.push(box2);

    const box3 = makeBox({ status: "VERIFIED" });
    boxesRepository.items.push(box3);

    const catalog = makeCatalog();
    catalogsRepository.items.push(catalog);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const { farms, boxes } = await sut.execute({ cycle_id: cycle.id.value });

    expect(farms).toBe(3);
    expect(boxes).toBe(2);
  });
});
