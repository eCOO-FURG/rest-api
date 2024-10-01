// Use-cases
import { RequestPasswordUpdateUseCase } from "@/core/use-cases/request-password-update";

// Libs
import { MockInstance } from "vitest";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Services
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";
import { makeUser } from "@/test/factories/make-user";
import { waitFor } from "@/test/utils/wait-for";

// Events
import { OnUpdatePasswordRequestEvent } from "@/core/events/on-password-update-requested";
import { DomainEvents } from "@/core/events/domain-events";

let sut: RequestPasswordUpdateUseCase;

let spy: MockInstance

let usersRepository: InMemoryUsersRepository;

let mocks: {
  mailer: MockedMailer,
  hasher: MockedHasher
}


describe("on update password request", () => {
  beforeEach(()=> {
    usersRepository = new InMemoryUsersRepository();

    mocks = {
      mailer: new MockedMailer(),
      hasher: new MockedHasher()
    }
    
    sut = new RequestPasswordUpdateUseCase(usersRepository, mocks.mailer, mocks.hasher);
    new OnUpdatePasswordRequestEvent(usersRepository, mocks.mailer);

    spy = vi.spyOn(DomainEvents, "dispatch")
  })

  it("should be called when a password update is requested", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    await sut.execute({
      email: user.email
    })
 
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    })
  })
})