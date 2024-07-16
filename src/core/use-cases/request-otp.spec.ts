// Services
import { makeUser } from "@/test/factories/make-user"
import { MockedOtpProvider } from "@/test/cryptography/mocked-otp-provider";

// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository"
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";

// Use-cases
import { RequestOtpUseCase } from "@/core/use-cases/request-otp";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let repositories: {
  users: InMemoryUsersRepository
  otps: InMemoryOtpsRepository
}

let mocks: {
  otpGenerator: MockedOtpProvider
}

let sut: RequestOtpUseCase;

describe("request otp", async () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
      otps: new InMemoryOtpsRepository()
    }

    mocks = {
      otpGenerator: new MockedOtpProvider()
    }

    sut = new RequestOtpUseCase(repositories.users, mocks.otpGenerator, repositories.otps)
  })

  it("should be able to request a otp", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({
      email: user.email
    });

    expect(repositories.otps.items[0]).toBeInstanceOf(Otp)
  })

  it("should not be able to request a otp for a user that does not exist", async () => {
    await expect(() =>
      sut.execute({
        email: "t@test.com"
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  })
})