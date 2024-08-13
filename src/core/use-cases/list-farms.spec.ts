// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";

// Use-cases
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { makeUser } from "@/test/factories/make-user";

let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;
let productsRepository: InMemoryProductsRepository;
let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let cyclesRepository: InMemoryCyclesRepository;

let sut: ListFarmsUseCase;

describe("list farms", () => {
  beforeEach(() => {
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );
    ordersRepository = new InMemoryOrdersRepository(
      offersRepository,
      productsRepository
    );
    productsRepository = new InMemoryProductsRepository();
    usersRepository = new InMemoryUsersRepository();

    farmsRepository = new InMemoryFarmsRepository(
      usersRepository,
      offersRepository,
      productsRepository,
      ordersRepository
    );

    sut = new ListFarmsUseCase(farmsRepository);
  });

  it("should be able to list farms", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm1 = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm1);

    const response = await sut.execute({
      page: 1,
    });

    expect(response.farms).toHaveLength(1);
  });

  it("should be able to list farms by name", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm1 = makeFarm({ admin_id: user.id, name: "Fazenda do Eduardo" });
    await farmsRepository.create(farm1);

    const farm2 = makeFarm({ admin_id: user.id, name: "Farm 2" });
    await farmsRepository.create(farm2);

    const response = await sut.execute({
      page: 1,
      name: "Fazenda",
    });

    expect(response.farms).toHaveLength(1);
  });
});
