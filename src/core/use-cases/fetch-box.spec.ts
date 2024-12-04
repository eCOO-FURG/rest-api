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
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let boxesRepository: InMemoryBoxesRepository;

let sut: FetchBoxUseCase;

describe("list farm sales", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();

    usersRepository = new InMemoryUsersRepository();
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

    boxesRepository = new InMemoryBoxesRepository(
      catalogsRepository,
      ordersRepository
    );

    sut = new FetchBoxUseCase(usersRepository, boxesRepository);
  });

  it("should be able to fetch a box", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id, admin: user });
    await farmsRepository.create(farm);

    const product = makeProduct();
    await productsRepository.create(product);

    const catalog = makeCatalog({ farm_id: farm.id, farm });
    await catalogsRepository.create(catalog);

    const offer = makeOffer({
      catalog_id: catalog.id,
      product_id: product.id,
    });

    offersRepository.items.push(offer);

    const box = makeBox({ catalog_id: catalog.id, catalog });
    await boxesRepository.create(box);

    const order = makeOrder({
      offer_id: offer.id,
      amount: offer.amount,
      box_id: box.id,
    });

    ordersRepository.items.push(order);

    const result = await sut.execute({
      box_id: box.id.value,
      user_id: user.id.value,
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
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
