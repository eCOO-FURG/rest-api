// Use-cases
import { UpdateUserUseCase } from "@/core/use-cases/update-user";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { MockedStorage } from "@/test/storage/mocked-storage";

// Factories
import { makeFile } from "@/test/factories/make-file";
import { makeUser } from "@/test/factories/make-user";

let repositories: {
  users: InMemoryUsersRepository;
};

let mocks: {
  encrypter: MockedEncrypter;
  storage: MockedStorage;
};

let sut: UpdateUserUseCase;

describe("update user", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
    };

    mocks = {
      encrypter: new MockedEncrypter(),
      storage: new MockedStorage(),
    };

    sut = new UpdateUserUseCase(
      repositories.users,
      mocks.encrypter,
      mocks.storage
    );
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
    });

    expect(repositories.users.items[0].first_name).toEqual("João");
    expect(repositories.users.items[0].last_name).toEqual("Silva");
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

  it("should hash the password", async () => {
    const password = "12345678";

    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({
      user_id: user.id.value,
      password: password,
    });

    const updatedUser = repositories.users.items[0];
    const isPasswordHashed = updatedUser.password !== password;

    expect(isPasswordHashed).toBeTruthy();
  });

  it("should be able to upload a user photo", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({ user_id: user.id.value, photo: makeFile() });

    const updatedUser = repositories.users.items[0];

    expect(updatedUser.photo).toBeTruthy();
    expect(updatedUser.photo).toContain("temp/users");
  });
});
