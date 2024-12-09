// Use-cases
import { ListBoxesUseCase } from "@/core/use-cases/list-boxes";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";
import { makeOrder } from "@/test/factories/make-order";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeBox } from "@/test/factories/make-box";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let cyclesRepository: InMemoryCyclesRepository;
let boxesRepository: InMemoryBoxesRepository;

let sut: ListBoxesUseCase;

describe("list farms with orders", () => {
  beforeEach(() => {
    cyclesRepository = new InMemoryCyclesRepository();
    boxesRepository = new InMemoryBoxesRepository();

    sut = new ListBoxesUseCase(cyclesRepository, boxesRepository);
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
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const box = makeBox();
    await boxesRepository.create(box);

    const { boxes } = await sut.execute({ cycle_id: cycle.id.value, page: 1 });

    expect(boxes).toHaveLength(1);
  });

  it("should be able to search boxes by farm name", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const farm = makeFarm({ name: "Fazenda 1" });

    const catalog = makeCatalog({
      farm_id: farm.id,
      farm,
      cycle_id: cycle.id,
    });

    const box = makeBox({ catalog_id: catalog.id, catalog });

    const product = makeProduct();

    const offer = makeOffer({ catalog_id: catalog.id, product_id: product.id });

    const order = makeOrder({ offer_id: offer.id });

    box.orders.set(order.id.value, order);

    await boxesRepository.create(box);

    const { boxes } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 1,
      farm: "Fazenda",
    });

    expect(boxes).toHaveLength(1);
  });

  it("should be able to list paginated cycle boxes", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    for (let i = 1; i <= 22; i++) {
      const admin = makeUser();

      const farm = makeFarm({
        name: `Fazenda ${i}`,
        admin_id: admin.id,
      });

      const catalog = makeCatalog({ farm_id: farm.id, cycle_id: cycle.id });

      const box = makeBox({ catalog_id: catalog.id });

      await boxesRepository.create(box);
    }

    const { boxes } = await sut.execute({
      cycle_id: cycle.id.value,
      page: 2,
    });

    expect(boxes).toHaveLength(2);
  });
});
