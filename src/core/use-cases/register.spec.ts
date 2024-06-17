// Entities
import { User } from "@/core/entities/user";

// Use-cases
import { RegisterUseCase } from "./register";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { makeUser } from "@/test/factories/make-user";

let repositories: {
  users: InMemoryUsersRepository;
};

let mocks: {
  encrypter: MockedEncrypter;
};

let sut: RegisterUseCase;

describe("register", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
    };

    mocks = {
      encrypter: new MockedEncrypter(),
    };

    sut = new RegisterUseCase(repositories.users, mocks.encrypter);
  });

  it("should be able to register", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(repositories.users.items[0]).toBeInstanceOf(User);
  });

  it("should be able to register with an empty password", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(repositories.users.items[0]).toBeInstanceOf(User);
    expect(repositories.users.items[0].password).toBeNull();
  });

  it("should not be able to register with the same email twice", async () => {
    const email = "johndoe@example.com";

    const user = makeUser({ email });

    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        phone: "51987654321",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: "523.065.281-02",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same cellphone twice", async () => {
    const phone = "51987654321";

    const user = makeUser({ phone });

    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        email: "rodrigogoes@example.com",
        phone: "51987654321",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: "523.065.281-02",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same CPF twice", async () => {
    const cpf = "523.065.281-01";

    const user = makeUser({ cpf });

    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        email: "rodrigogoes@example.com",
        phone: "51cellphone987654321",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf,
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should hash the password", async () => {
    const password = "123456";

    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      password,
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(repositories.users.items[0].password === password).toBeFalsy;
  });
});
