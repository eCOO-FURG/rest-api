// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryOrdersRepository } from "@/test/repositories/in-memory-orders-repository";

// Use-cases
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { makeUser } from "@/test/factories/make-user";

// Entities
import { Farm } from "@/core/entities/farm";

let usersRepository: InMemoryUsersRepository;
let cyclesRepository: InMemoryCyclesRepository;
let productsRepository: InMemoryProductsRepository;
let offersRepository: InMemoryOffersRepository;
let ordersRepository: InMemoryOrdersRepository;

let repositories: {
  users: InMemoryUsersRepository;
  farm: InMemoryFarmsRepository;
};

let sut: RegisterFarmUseCase;

describe("create farm", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    cyclesRepository = new InMemoryCyclesRepository();
    productsRepository = new InMemoryProductsRepository();
    offersRepository = new InMemoryOffersRepository(
      productsRepository,
      cyclesRepository
    );
    ordersRepository = new InMemoryOrdersRepository(offersRepository, productsRepository);

    repositories = {
      users: usersRepository,
      farm: new InMemoryFarmsRepository(
        usersRepository,
        offersRepository,
        productsRepository,
        ordersRepository
      ),
    };

    sut = new RegisterFarmUseCase(repositories.users, repositories.farm);
  });

  it("should be able to create an farm", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({
      user_id: user.id.value,
      caf: "12345678",
      name: "Fazenda Feliz",
    });
  });

  it("should not be able to create two farms with the same caf", async () => {
    const user1 = makeUser();
    await repositories.users.create(user1);

    const user2 = makeUser();
    await repositories.users.create(user2);

    const caf = "12345678";

    const farm = Farm.create({
      admin_id: user1.id,
      caf,
      name: "Fazenda Triste",
    });

    await repositories.farm.create(farm);

    await expect(() =>
      sut.execute({
        user_id: user2.id.value,
        caf,
        name: "Fazenda Melancólica",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to create two farms with the same admin", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const farm = Farm.create({
      admin_id: user.id,
      caf: "12345678",
      name: "Fazenda Triste",
    });

    await repositories.farm.create(farm);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        caf: "34567890",
        name: "Fazenda Alegre",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
