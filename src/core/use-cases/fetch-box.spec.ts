// Use-cases
import { FetchBoxUseCase } from "@/core/use-cases/fetch-box";

import { makeFarm } from "@/test/factories/make-farm";
import { makeOffer } from "@/test/factories/make-offer";
import { makeOrder } from "@/test/factories/make-order";
import { makeProduct } from "@/test/factories/make-product";
import { makeBox } from "@/test/factories/make-box";
import { makeUser } from "@/test/factories/make-user";
import { makeCatalog } from "@/test/factories/make-catalog";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let boxesRepository: InMemoryBoxesRepository;

let sut: FetchBoxUseCase;

describe("list farm sales", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    boxesRepository = new InMemoryBoxesRepository();

    sut = new FetchBoxUseCase(usersRepository, boxesRepository);
  });

  it("should be able to fetch a box", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id, admin: user });

    const product = makeProduct();

    const catalog = makeCatalog({ farm_id: farm.id, farm });

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });

    const box = makeBox({ catalog_id: catalog.id, catalog });

    const order = makeOrder({
      offer_id: offer.id,
      amount: offer.amount,
      box_id: box.id,
    });

    box.orders.push(order);
    await boxesRepository.create(box);

    const result = await sut.execute({
      box_id: box.id.value,
      user_id: user.id.value,
      page: 1,
    });

    expect(result.box.orders.length).toBeGreaterThan(0);
  });

  it("should not be able to fetch a box that does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    await expect(() =>
      sut.execute({
        box_id: "",
        user_id: user.id.value,
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
