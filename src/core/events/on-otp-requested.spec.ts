// Use-cases
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";

// Libraries
import { MockInstance } from "vitest";

// Services
import { MockedOtpProvider } from "@/test/cryptography/mocked-otp-provider";
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Events
import { OnOtpRequestEvent } from "@/core/events/on-otp-requested";
import { DomainEvents } from "@/core/events/domain-events";
import { waitFor } from "@/test/utils/wait-for";

let sut: RequestOtpUseCase;

let spy: MockInstance;

let repositories: {
  users: InMemoryUsersRepository;
  otps: InMemoryOtpsRepository;
};

let mocks: {
  otpProvider: MockedOtpProvider;
  mailer: MockedMailer;
};

describe("on otp request", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
      otps: new InMemoryOtpsRepository(),
    };

    mocks = {
      otpProvider: new MockedOtpProvider(),
      mailer: new MockedMailer(),
    };

    sut = new RequestOtpUseCase(
      repositories.users,
      mocks.otpProvider,
      repositories.otps
    );
    new OnOtpRequestEvent(repositories.users, mocks.mailer);

    spy = vi.spyOn(DomainEvents, "dispatch");
  });

  it("should be called when a otp is requested", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({
      email: user.email,
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
});
