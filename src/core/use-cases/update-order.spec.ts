// Repositories
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryBagsRepository } from "@/test/repositories/in-memory-bags-repository";

// Use-cases
import { UpdateOrderUseCase } from "@/core/use-cases/update-order";

// Factories
import { makeOrder } from "@/test/factories/make-order";
import { makeUser } from "@/test/factories/make-user";
import { makeBag } from "@/test/factories/make-bag";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let ordersRepository: InMemoryOrdersRepository;
let usersRepository: InMemoryUsersRepository;
let bagsRepository: InMemoryBagsRepository;

let sut: UpdateOrderUseCase;

describe("update order", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    bagsRepository = new InMemoryBagsRepository();
    sut = new UpdateOrderUseCase(
      usersRepository,
      bagsRepository,
      ordersRepository
    );
  });

  it("should be able to update an order", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const bag = makeBag({ customer_id: user.id, customer: user });
    bagsRepository.items.push(bag);

    const order = makeOrder({ bag, bag_id: bag.id });
    ordersRepository.items.push(order);

    await sut.execute({
      user_id: user.id.value,
      order_id: order.id.value,
      status: "RECEIVED",
    });

    expect(ordersRepository.items[0].status).toBe("RECEIVED");
  });

  it("should not be able to update an order from another user", async () => {
    const user = makeUser();
    usersRepository.items.push(user);

    const order = makeOrder();
    ordersRepository.items.push(order);

    await expect(
      sut.execute({
        user_id: user.id.value,
        order_id: order.id.value,
        status: "RECEIVED",
      })
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
