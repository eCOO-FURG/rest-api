// Use-cases
import { FetchPendingsUseCase } from "@/core/use-cases/fetch-pendings";

// Repositories
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeUser } from "@/test/factories/make-user";
import { makeBox } from "@/test/factories/make-box";

// Cache
import { MockedCacheManager } from "@/test/cache/mocked-cache-manager";

let boxesRepository: InMemoryBoxesRepository;
let farmsRepository: InMemoryFarmsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let cacheManager: MockedCacheManager;

let sut: FetchPendingsUseCase;

describe("Fetch pendings", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    farmsRepository = new InMemoryFarmsRepository();

    boxesRepository = new InMemoryBoxesRepository();

    cacheManager = new MockedCacheManager();

    sut = new FetchPendingsUseCase(cyclesRepository, farmsRepository, boxesRepository, cacheManager);
  });

  it("should be able to fetch pending farms and boxes in a cycle", async () => {
    const user = makeUser();

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

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const { farms, boxes } = await sut.execute({ cycle_id: cycle.id.value });

    expect(farms).toBe(3);
    expect(boxes).toBe(2);
  });
});
