// Use-cases
import { RequestHelpUseCase } from "@/core/use-cases/request-help";

// Libs
import { MockInstance } from "vitest";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Services
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { makeFarm } from "@/test/factories/make-farm";
import { waitFor } from "@/test/utils/wait-for";

// Events
import { OnRequestHelpEvent } from "@/core/events/on-request-help";
import { DomainEvents } from "@/core/events/domain-events";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { makeUser } from "@/test/factories/make-user";

// Mocks
let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;

let mocks: {
  mailer: MockedMailer;
};

let sut: RequestHelpUseCase;

let spy: MockInstance;

describe("on request help event", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository(),
    farmsRepository = new InMemoryFarmsRepository
  
    mocks = {
      mailer: new MockedMailer(),
    };

    sut = new RequestHelpUseCase(usersRepository);
    new OnRequestHelpEvent(farmsRepository, mocks.mailer);

    spy = vi.spyOn(DomainEvents, "dispatch");
  });

  it("should be called when a help request is created", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = makeFarm({
      admin_id: user.id
    });
    await farmsRepository.create(farm)

    await sut.execute({
      user_id: user.id.value,
      content: "AJUDAAA",
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
});
