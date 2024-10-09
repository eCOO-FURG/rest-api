// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

// Services
import { makeUser } from "@/test/factories/make-user";
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";

// Use-cases
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";

// Events
import { OnUpdatePasswordRequestEvent } from "@/core/events/on-password-update-requested";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Test
import { waitFor } from "@/test/utils/wait-for";
import { MockInstance } from "vitest";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let repositories: {
  users: InMemoryUsersRepository;
};

let mocks: {
  mailer: MockedMailer;
  hasher: MockedHasher;
};

let sut: RequestPasswordUpdateUseCase;
let _event: OnUpdatePasswordRequestEvent;

let spy: MockInstance;

describe("request password update", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
    };

    mocks = {
      mailer: new MockedMailer(),
      hasher: new MockedHasher(),
    };

    sut = new RequestPasswordUpdateUseCase(repositories.users);

    _event = new OnUpdatePasswordRequestEvent(
      repositories.users,
      mocks.hasher,
      mocks.mailer
    );

    spy = vi.spyOn(mocks.mailer, "send");
  });

  it("should be able to request a password update", async () => {
    const user = makeUser({ id: new UUID() });
    await repositories.users.create(user);

    await sut.execute({
      email: user.email,
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it("nonexisting user should not be able to request a password update", async () => {
    await expect(
      sut.execute({
        email: "eduardo@email.com",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
