// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";

// Events
import { DomainEvents } from "./domain-events";
import { OnRegisteredEvent } from "./on-registered";

// Test
import { MockInstance } from "vitest";
import { waitFor } from "@/test/utils/wait-for";

let repositories: {
  users: InMemoryUsersRepository;
};

let mocks: {
  encrypter: MockedEncrypter;
  mailer: MockedMailer;
  hasher: MockedHasher;
};

let sut: RegisterUseCase;

let spy: MockInstance;

describe("on account created", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
    };

    mocks = {
      encrypter: new MockedEncrypter(),
      mailer: new MockedMailer(),
      hasher: new MockedHasher(),
    };

    sut = new RegisterUseCase(repositories.users, mocks.encrypter);
    new OnRegisteredEvent(mocks.mailer, mocks.hasher);

    spy = vi.spyOn(DomainEvents, "dispatch");
  });

  it("it should be called when a user is registered", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "Rodrigo",
      last_name: "Goes",
      cpf: "523.065.281-02",
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
});
