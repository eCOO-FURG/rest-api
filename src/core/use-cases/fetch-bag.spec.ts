// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";
import { makeOrder } from "@/test/factories/make-order";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";
import { makeFarm } from "@/test/factories/make-farm";
import { makeCatalog } from "@/test/factories/make-catalog";

// Entities
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

let usersRepository: InMemoryUsersRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let farmsRepository: InMemoryFarmsRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let addressesRepository: InMemoryAddressesRepository;
let paymentsRepository: InMemoryPaymentsRepository;

let repositories: {
  bags: InMemoryBagsRepository;
};

let sut: FetchBagUseCase;

describe("Fetch bag", () => {
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
    addressesRepository = new InMemoryAddressesRepository();
    paymentsRepository = new InMemoryPaymentsRepository();
    repositories = {
      bags: new InMemoryBagsRepository(
        usersRepository,
        ordersRepository,
        addressesRepository,
        paymentsRepository
      ),
    };

    sut = new FetchBagUseCase(repositories.bags);
  });

  it("should be able to fetch a user bag", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const bag = makeBag({ user_id: user.id });
    await repositories.bags.create(bag);

    const product = makeProduct();
    await productsRepository.create(product);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({ farm_id: farm.id });
    await catalogsRepository.create(catalog);

    const offer = makeOffer({ product_id: product.id, catalog_id: catalog.id });
    await offersRepository.create(offer);

    const order = makeOrder({ bag_id: bag.id, offer_id: offer.id });
    await ordersRepository.createMany([order]);

    const result = await sut.execute({
      bag_id: bag.id.value,
    });

    expect(result.bag).toBeInstanceOf(BagMerge);
    expect(result.bag.orders).toBeInstanceOf(Array<OrderAggregate>);
    expect(result.bag.orders.length).toBe(1);
  });

  it("should not be able to fetch a bag that does not exists", async () => {
    await expect(() =>
      sut.execute({
        bag_id: "1234",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
