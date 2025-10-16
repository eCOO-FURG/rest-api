// Repositories
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { FetchBagUseCase } from "@/core/use-cases/fetch-bag";

// Entities
import { Bag } from "@/core/entities/bag";

// Factories
import { makeBag } from "@/test/factories/make-bag";
import { makeUser } from "@/test/factories/make-user";
import { makeOrder } from "@/test/factories/make-order";
import { makeProduct } from "@/test/factories/make-product";
import { makeOffer } from "@/test/factories/make-offer";
import { makeFarm } from "@/test/factories/make-farm";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let bagsRepository: InMemoryBagsRepository;
let sut: FetchBagUseCase;

describe("Fetch bag", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bagsRepository = new InMemoryBagsRepository();

    sut = new FetchBagUseCase(bagsRepository, usersRepository);
  });

  it("should be able to fetch a user bag", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const product = makeProduct();

    const farm = makeFarm({ admin_id: user.id });

    const offer = makeOffer({ product_id: product.id, farm_id: farm.id });

    const bag = makeBag({ customer_id: user.id });

    const order = makeOrder({ bag_id: bag.id, offer_id: offer.id });

    bag.orders.push(order);

    await bagsRepository.save(bag);

    const result = await sut.execute({
      bag_id: bag.id.value,
      user_id: user.id.value,
      page: 1,
    });

    expect(result.bag).toBeInstanceOf(Bag);
    expect(result.bag.orders.length).toBe(1);
  });

  it("should not be able to fetch a bag that does not exists", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    await expect(() =>
      sut.execute({
        bag_id: "1234",
        user_id: user.id.value,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to fetch a bag of another user", async () => {
    const user1 = makeUser();
    await usersRepository.create(user1);

    const user2 = makeUser();
    await usersRepository.create(user2);

    const bag = makeBag({ customer_id: user1.id });
    await bagsRepository.save(bag);

    await expect(() =>
      sut.execute({
        bag_id: bag.id.value,
        user_id: user2.id.value,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
