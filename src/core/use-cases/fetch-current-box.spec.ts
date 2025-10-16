// Factories
import { makeBox } from "@/test/factories/make-box";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeFarm } from "@/test/factories/make-farm";
import { makeFarmAndAdmin } from "@/test/factories/make-farm-and-admin";
import { makeBoxAndOrders } from "@/test/factories/make-box-and-orders";

// Use Cases
import { FetchCurrentBoxUseCase } from "@/core/use-cases/fetch-current-box";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

let boxesRepository: InMemoryBoxesRepository;
let cyclesRepository: InMemoryCyclesRepository;
let farmsRepository: InMemoryFarmsRepository;

let sut: FetchCurrentBoxUseCase;

describe("fetch current box", () => {
  beforeEach(() => {
    boxesRepository = new InMemoryBoxesRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    farmsRepository = new InMemoryFarmsRepository();
    sut = new FetchCurrentBoxUseCase(boxesRepository, cyclesRepository, farmsRepository);
  });

  it("should be able to fetch the farm current current box", async () => {
    const cycle = makeCycle({
      order: [1, 2, 3, 4, 5, 6, 7],
    });
    cyclesRepository.items.push(cycle);

    const farm = makeFarm();
    farmsRepository.items.push(farm);

    const box = makeBox({
      cycle_id: cycle.id,
      farm_id: farm.id,
    });

    boxesRepository.items.push(makeBoxAndOrders(box));

    const { box: found } = await sut.execute({
      farm_id: farm.id.value,
      cycle_id: cycle.id.value,
      page: 1,
    });

    expect(box.id).toEqual(found.id);
    expect(box.farm_id).toEqual(found.farm_id);
  });

  it("should not be able to fetch a box with a non-existent cycle", async () => {
    const farm = makeFarm();

    const box = makeBox({
      farm: makeFarmAndAdmin(farm),
    });
    await boxesRepository.create(box);

    await expect(() =>
      sut.execute({
        farm_id: farm.id.value,
        cycle_id: "non-existent-id",
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to fetch a non-existent box", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        farm_id: "non-existent-id",
        cycle_id: cycle.id.value,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
