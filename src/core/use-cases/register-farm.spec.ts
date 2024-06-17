// Repositories
import { InMemoryFarmRepository } from "@/test/repositories/in-memory-farm-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { RegisterFarmUseCase } from "./register-farm";

// Errors
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists";

// Services
import { makeUser } from "@/test/factories/make-user";

// Entities
import { Farm } from "../entities/farm";

let repositories: {
  users: InMemoryUsersRepository;
  farm: InMemoryFarmRepository;
};

let sut: RegisterFarmUseCase;

describe("create farm", () => {
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository();

    repositories = {
      users: usersRepository,
      farm: new InMemoryFarmRepository(usersRepository),
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

    await repositories.farm.save(farm);

    await expect(() =>
      sut.execute({
        user_id: user2.id.value,
        caf,
        name: "Fazenda Melancólica",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to create two farms with same admin", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const farm = Farm.create({
      admin_id: user.id,
      caf: "12345678",
      name: "Fazenda Triste",
    });

    await repositories.farm.save(farm);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        caf: "34567890",
        name: "Fazenda Alegre",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
