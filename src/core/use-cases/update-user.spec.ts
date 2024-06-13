// Use-cases
import { UpdateUserUseCase } from "./update-user";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors

// Services
import { makeUser } from "@/test/factories/make-user";
import { ResourceNotFoundError } from "../errors/resource-not-found";

let repositories: {
  users: InMemoryUsersRepository;
};

let sut: UpdateUserUseCase;

describe("update user", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
    };

    sut = new UpdateUserUseCase(repositories.users);
  });

  it("should be able to update only one user field", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({
      user_id: user.id.value,
      first_name: "Cláudio",
    });

    expect(repositories.users.items[0].first_name).toEqual("Cláudio");
  });

  it("should be able to update more than one user field", async () => {
    const cpf = "12345678910";

    const user = makeUser({ cpf });
    await repositories.users.create(user);

    await sut.execute({
      user_id: user.id.value,
      first_name: "João",
      last_name: "Silva",
      password: "12345678",
    });

    expect(repositories.users.items[0].first_name).toEqual("João");
    expect(repositories.users.items[0].last_name).toEqual("Silva");
    expect(repositories.users.items[0].password).toEqual("12345678");
    expect(repositories.users.items[0].cpf).toEqual(cpf);
  });

  it("should not be able to update a non existing user", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        user_id: "idinexistente",
        first_name: "Sérgio",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
