// Entities
import { User } from "@/core/entities/user";

// Use-cases
import { RequestHelpUseCase } from "@/core/use-cases/request-help";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeFarm } from "@/test/factories/make-farm";

// Mail
import { MockedMailer } from "@/test/mail/mocked-mailer";

// Libraries
import { beforeEach, expect, MockInstance } from "vitest";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let mailer: MockedMailer;

let sut: RequestHelpUseCase;

let spy: MockInstance;

describe("RequestHelpUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository();
    mailer = new MockedMailer();

    sut = new RequestHelpUseCase(usersRepository, farmsRepository, mailer);
  });

  it("should dispatch a help request event for an existing user", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm);

    await sut.execute({
      user_id: user.id.value,
      content: "HELP ME!",
    });

    expect(usersRepository.items[0]).toBeInstanceOf(User);
  });

  it("should throw a ResourceNotFoundError if the user does not exist", async () => {
    await expect(() =>
      sut.execute({
        user_id: "232",
        content: "HELP ME!",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
