// Entities
import { User } from "@/core/entities/user";

// Use-cases
import { AuthenticateUseCase } from "@/core/use-cases/authenticate";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";
import { makeUser } from "@/test/factories/make-user";

// Repositories
import { InMemoryOtpsRepository } from "@/test/repositories/in-memory-otps-repository";
import { InMemorySessionsRepository } from "@/test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";
import { makeOtp } from "@/test/factories/make-otp";
import { UserNotVerifiedError } from "@/core/errors/user-not-verified";

let repositories: {
  users: InMemoryUsersRepository;
  otps: InMemoryOtpsRepository;
  sessions: InMemorySessionsRepository;
};

let mocks: {
  encrypter: MockedEncrypter;
  hasher: MockedHasher;
};

let sut: AuthenticateUseCase;

describe("authenticate", () => {
  beforeEach(() => {
    repositories = {
      users: new InMemoryUsersRepository(),
      otps: new InMemoryOtpsRepository(),
      sessions: new InMemorySessionsRepository(),
    };

    mocks = {
      encrypter: new MockedEncrypter(),
      hasher: new MockedHasher(),
    };

    sut = new AuthenticateUseCase(
      repositories.users,
      repositories.otps,
      repositories.sessions,
      mocks.encrypter,
      mocks.hasher
    );
  });

  it("should be able to authenticate via basic auth", async () => {
    const password = await mocks.encrypter.encrypt("12345678");

    const user = makeUser({ password, verified_at: new Date() });

    await repositories.users.create(user);

    const result = await sut.execute({
      email: user.email,
      password: "12345678",
      agent: "browser",
      ip: "0.0.0.0",
      type: "BASIC",
    });

    expect(result.user).toBeInstanceOf(User);
    expect(result.token).toBeTypeOf("string");
    expect(repositories.sessions.items).toHaveLength(1);
  });

  it("should be able to authenticate via otp", async () => {
    const user = makeUser({ verified_at: new Date() });

    await repositories.users.create(user);

    const otp = makeOtp({ user_id: user.id });

    await repositories.otps.create(otp);

    const result = await sut.execute({
      email: user.email,
      password: otp.value,
      agent: "browser",
      ip: "0.0.0.0",
      type: "OTP",
    });

    expect(result.token).toBeTypeOf("string");
    expect(repositories.sessions.items).toHaveLength(1);
    expect(repositories.otps.items[0].used).toBeTruthy();
  });

  it("should not be able to authenticate with wrong basic credentials", async () => {
    const password = await mocks.encrypter.encrypt("12345678");

    const user = makeUser({ password, verified_at: new Date() });

    repositories.users.create(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "8765421",
        agent: "browser",
        ip: "0.0.0.0",
        type: "BASIC",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate with wrong otp credentials", async () => {
    const user = makeUser({ verified_at: new Date() });

    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "8765421",
        agent: "browser",
        ip: "0.0.0.0",
        type: "OTP",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not authenticate an unverifed user", async () => {
    const password = await mocks.encrypter.encrypt("12345678");

    const user = makeUser({ password });

    await repositories.users.create(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "12345678",
        agent: "browser",
        ip: "0.0.0.0",
        type: "BASIC",
      })
    ).rejects.toBeInstanceOf(UserNotVerifiedError);
  });

  it("should not authenticate an  user that does not exists", async () => {
    await expect(() =>
      sut.execute({
        email: "email@domain.con",
        password: "12345678",
        agent: "browser",
        ip: "0.0.0.0",
        type: "BASIC",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
});
