// Entities
import { Week } from "@/core/entities/cycle";

// Use-cases
import { OrderProductsUseCase } from "@/core/use-cases/order-products";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnavailableAmountError } from "@/core/errors/unavailable-amount";
import { InvalidWeightError } from "@/core/errors/invalid-weight";
import { ResourceClosedError } from "@/core/errors/resource-closed";

// Factories
import { makeOffer } from "@/test/factories/make-offer";
import { makeCycle } from "@/test/factories/make-cycle";
import { makeUser } from "@/test/factories/make-user";
import { makeProduct } from "@/test/factories/make-product";
import { makeBag } from "@/test/factories/make-bag";
import { makeCatalog } from "@/test/factories/make-catalog";
import { makeAddress } from "@/test/factories/make-address";
import { makeFarm } from "@/test/factories/make-farm";

// Repositories
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryBoxesRepository } from "@/test/repositories/in-memory-boxes-repository";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryAddressesRepository } from "@/test/repositories/in-memory-addresses-repository";
import { InMemoryPaymentsRepository } from "@/test/repositories/in-memory-payments-repository";

// Services
import { MockedOtpProvider } from "@/test/cryptography/mocked-otp-provider";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let farmsRepository: InMemoryFarmsRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let catalogsRepository: InMemoryCatalogsRepository;
let addressesRepository: InMemoryAddressesRepository;
let paymentsRepository: InMemoryPaymentsRepository;

let otpProvider: MockedOtpProvider;

let repositories: {
  users: InMemoryUsersRepository;
  offers: InMemoryOffersRepository;
  orders: InMemoryOrdersRepository;
  products: InMemoryProductsRepository;
  bags: InMemoryBagsRepository;
  cycles: InMemoryCyclesRepository;
  catalogs: InMemoryCatalogsRepository;
  boxes: InMemoryBoxesRepository;
  addresses: InMemoryAddressesRepository;
};

let sut: OrderProductsUseCase;

describe("order product", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
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
      users: usersRepository,
      products: productsRepository,
      offers: offersRepository,
      orders: ordersRepository,
      bags: new InMemoryBagsRepository(
        usersRepository,
        ordersRepository,
        addressesRepository,
        paymentsRepository
      ),
      cycles: cyclesRepository,
      catalogs: catalogsRepository,
      boxes: new InMemoryBoxesRepository(catalogsRepository, ordersRepository),
      addresses: addressesRepository,
    };

    otpProvider = new MockedOtpProvider();

    sut = new OrderProductsUseCase(
      repositories.users,
      repositories.cycles,
      repositories.offers,
      repositories.catalogs,
      repositories.bags,
      repositories.boxes,
      repositories.addresses,
      otpProvider
    );
  });

  it("should be able to order a product from an offer", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({ pricing: "UNIT" });
    await repositories.products.create(product);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({ cycle_id: cycle.id, farm_id: farm.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({
      product_id: product.id,
      catalog_id: catalog.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await sut.execute({
      user_id: user.id.value,
      cycle_id: cycle.id.value,
      address: {
        street: "street",
        number: "number",
        complement: "complement",
        neighborhood: "neighborhood",
        postal_code: "12345-678",
      },
      request: [{ offer_id: offer.id.value, amount: 5 }],
    });

    expect(repositories.bags.items.length).toBe(1);
    expect(repositories.bags.items[0].orders.length).toBe(1);
  });

  it("should be add orders to a existing bag if exists", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const address = makeAddress();
    repositories.addresses.items.push(address);

    const bag = makeBag({
      user_id: user.id,
      cycle_id: cycle.id,
      address_id: address.id,
      address: address,
    });
    await repositories.bags.create(bag);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({ cycle_id: cycle.id, farm_id: farm.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({
      product_id: product.id,
      catalog_id: catalog.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await sut.execute({
      user_id: user.id.value,
      cycle_id: cycle.id.value,
      address: {
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        postal_code: address.postal_code,
      },
      request: [{ offer_id: offer.id.value, amount: 5 }],
    });

    expect(repositories.bags.items[0].orders.length).toBe(1);
  });

  it("should not allow an non existing user to create an order", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        user_id: "1234",
        cycle_id: cycle.id.value,
        address: {
          street: "street",
          number: "number",
          complement: "complement",
          neighborhood: "neighborhood",
          postal_code: "12345-678",
        },
        request: [
          {
            offer_id: "1234",
            amount: 5,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not create orders from a non existent cycle", async () => {
    const user = makeUser();
    repositories.users.items.push(user);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: "1234",
        request: [
          {
            offer_id: "1234",
            amount: 5,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able create an order from a non existing offer", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        request: [{ offer_id: "1234", amount: 5 }],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able create an order from a cycle different than the requested", async () => {
    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const user = makeUser();
    await repositories.users.create(user);

    const product = makeProduct();
    await repositories.products.create(product);

    const offer = makeOffer({
      product_id: product.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        request: [{ offer_id: offer.id.value, amount: 5 }],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able create an order outside the cycle day", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const today = (new Date().getDay() + 1) as Week[0];

    const orderDays = [1, 2, 3, 4, 5, 6, 7].filter((day) => day != today);

    const cycle = makeCycle({
      order: orderDays as Week,
    });

    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({ cycle_id: cycle.id, farm_id: farm.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({
      product_id: product.id,
      catalog_id: catalog.id,
      amount: 10,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        request: [
          {
            offer_id: offer.id.value,
            amount: 5,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceClosedError);
  });

  it("should not be able create an order with an amount greater than the offer", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct();
    await repositories.products.create(product);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({ cycle_id: cycle.id, farm_id: farm.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({
      product_id: product.id,
      catalog_id: catalog.id,
      amount: 5,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        request: [{ offer_id: offer.id.value, amount: 15 }],
      })
    ).rejects.toBeInstanceOf(UnavailableAmountError);
  });

  it("should not be able create an order with an invalid amount", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const cycle = makeCycle();
    cyclesRepository.items.push(cycle);

    const product = makeProduct({
      pricing: "WEIGHT",
    });
    await repositories.products.create(product);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    const catalog = makeCatalog({ cycle_id: cycle.id, farm_id: farm.id });
    await repositories.catalogs.create(catalog);

    const offer = makeOffer({
      product_id: product.id,
      catalog_id: catalog.id,
      amount: 500,
    });

    await repositories.offers.create(offer);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        cycle_id: cycle.id.value,
        request: [{ offer_id: offer.id.value, amount: 27 }],
      })
    ).rejects.toBeInstanceOf(InvalidWeightError);
  });
});
