// Factories
import { makeUser } from "@/test/factories/make-user";

// Cryptography
import { MockedOtpProvider } from "@/test/cryptography/mocked-otp-provider";

// Mail
import { MockedMailer } from "@/test/mail/mocked-mailer";

// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";

// Use-cases
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UserNotVerifiedError } from "@/core/errors/user-not-verified";

let usersRepository: InMemoryUsersRepository;
let otpsRepository: InMemoryOtpsRepository;
let mailer: MockedMailer;

let otpGenerator: MockedOtpProvider;

let sut: RequestOtpUseCase;

describe("request otp", async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    otpsRepository = new InMemoryOtpsRepository();

    otpGenerator = new MockedOtpProvider();
    mailer = new MockedMailer();

    sut = new RequestOtpUseCase(
      usersRepository,
      otpGenerator,
      otpsRepository,
      mailer,
    );
  });

  it("should be able to request a otp", async () => {
    const user = makeUser({
      verified_at: new Date(),
    });
    await usersRepository.create(user);

    await sut.execute({
      email: user.email,
    });

    expect(otpsRepository.items[0]).toBeInstanceOf(Otp);
  });

  it("should not be able to request a otp for a user that does not exist", async () => {
    await expect(() =>
      sut.execute({
        email: "t@test.com",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to request otp for unverified user", async () => {
    const user = makeUser();

    await usersRepository.create(user);

    await expect(() =>
      sut.execute({
        email: user.email,
      }),
    ).rejects.toBeInstanceOf(UserNotVerifiedError);
  });
});
