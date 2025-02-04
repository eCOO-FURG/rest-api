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

// Events
import { DomainEvents } from "@/core/events/domain-events";

// Libraries
import { MockInstance } from "vitest";

import { waitFor } from "@/test/utils/wait-for";

let usersRepository: InMemoryUsersRepository;

let sut: RequestHelpUseCase;

let spy: MockInstance;

describe("RequestHelpUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    sut = new RequestHelpUseCase(usersRepository);

    spy = vi.spyOn(DomainEvents, "dispatch");
  });

  it("should dispatch a help request event for an existing user", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    await sut.execute({
      user_id: user.id.value,
      message: "HELP ME!",
    });

    expect(usersRepository.items[0]).toBeInstanceOf(User);
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it("should throw a ResourceNotFoundError if the user does not exist", async () => {
    await expect(() =>
      sut.execute({
        user_id: "232",
        message: "HELP ME!",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
