// Entities
import { CPF } from "@/core/entities/cpf";
import { User } from "@/core/entities/user";
import { Phone } from "@/core/entities/phone";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";
import { MockedStorage } from "@/test/storage/mocked-storage";
import { makeUser } from "@/test/factories/make-user";

let repositories: {
  users: InMemoryUsersRepository;
};

let mocks: {
  encrypter: MockedEncrypter;
  hasher: MockedHasher;
  mailer: MockedMailer;
  storage: MockedStorage;
};

let sut: RegisterUseCase;

describe("register", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
    };

    mocks = {
      encrypter: new MockedEncrypter(),
      hasher: new MockedHasher(),
      mailer: new MockedMailer(),
      storage: new MockedStorage(),
    };

    sut = new RegisterUseCase(
      repositories.users,
      mocks.encrypter,
      mocks.hasher,
      mocks.storage,
      mocks.mailer,
    );
  });

  it("should be able to register", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "52306528101",
      role: "USER",
    });

    expect(repositories.users.items[0]).toBeInstanceOf(User);
  });

  it("should be able to register with an empty password", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      first_name: "John",
      last_name: "Doe",
      cpf: "52306528101",
      role: "USER",
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
        role: "USER",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same cellphone twice", async () => {
    const phone = new Phone("51987654321");

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
        role: "USER",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same CPF twice", async () => {
    const cpf = new CPF("52306528101");

    const user = makeUser({ cpf });

    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        email: "rodrigogoes@example.com",
        phone: "51987654321",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: cpf.value,
        role: "USER",
      }),
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
      cpf: "52306528101",
      role: "USER",
    });

    expect(repositories.users.items[0].password).not.toBe(password);
  });
});
