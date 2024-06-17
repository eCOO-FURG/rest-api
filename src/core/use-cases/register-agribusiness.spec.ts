// Repositories
import { InMemoryAgribusinessRepository } from "@/test/repositories/in-memory-agribusiness-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { RegisterAgribusinessUseCase } from "./register-agribusiness";

// Errors
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists";

// Services
import { makeUser } from "@/test/factories/make-user";

// Entities
import { Agribusiness } from "../entities/agribusiness";

let repositories: {
  users: InMemoryUsersRepository;
  agribusiness: InMemoryAgribusinessRepository;
};

let sut: RegisterAgribusinessUseCase;

describe("create agribusiness", () => {
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository();

    repositories = {
      users: usersRepository,
      agribusiness: new InMemoryAgribusinessRepository(usersRepository),
    };

    sut = new RegisterAgribusinessUseCase(
      repositories.users,
      repositories.agribusiness
    );
  });

  it("should be able to create an agribusiness", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({
      user_id: user.id.value,
      caf: "12345678",
      name: "Fazenda Feliz",
    });
  });

  it("should not be able to create two agribusiness with the same caf", async () => {
    const user1 = makeUser();
    await repositories.users.create(user1);

    const user2 = makeUser();
    await repositories.users.create(user2);

    const caf = "12345678";

    const agribusiness = Agribusiness.create({
      admin_id: user1.id,
      caf,
      name: "Fazenda Triste",
    });

    await repositories.agribusiness.save(agribusiness);

    await expect(() =>
      sut.execute({
        user_id: user2.id.value,
        caf,
        name: "Fazenda Melancólica",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to create two agribusiness with same admin", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const agribusiness = Agribusiness.create({
      admin_id: user.id,
      caf: "12345678",
      name: "Fazenda Triste",
    });

    await repositories.agribusiness.save(agribusiness);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        caf: "34567890",
        name: "Fazenda Alegre",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
