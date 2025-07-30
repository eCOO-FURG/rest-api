// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

// Services
import { makeUser } from "@/test/factories/make-user";
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";

// Use-cases
import { ResetPasswordUseCase } from "@/core/use-cases/reset-password";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let repositories: {
  users: InMemoryUsersRepository;
};

let mocks: {
  mailer: MockedMailer;
  hasher: MockedHasher;
};

let sut: ResetPasswordUseCase;

describe("request password update", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
    };

    mocks = {
      mailer: new MockedMailer(),
      hasher: new MockedHasher(),
    };

    sut = new ResetPasswordUseCase(
      repositories.users,
      mocks.hasher,
      mocks.mailer,
    );
  });

  it("should be able to request a password update", async () => {
    const user = makeUser({ id: new UUID() });
    await repositories.users.create(user);

    await sut.execute({
      email: user.email,
    });

    expect(mocks.mailer.messages).toHaveLength(1);
  });

  it("nonexisting user should not be able to request a password update", async () => {
    await expect(
      sut.execute({
        email: "eduardo@email.com",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
