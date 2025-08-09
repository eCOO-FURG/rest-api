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
import { UserNotVerifiedError } from "@/core/errors/user-not-verified";

// Utils
import { now } from "@/core/utils/now";

// Factories
import { makeOtp } from "@/test/factories/make-otp";

let usersRepository: InMemoryUsersRepository;
let otpsRepository: InMemoryOtpsRepository;
let sessionsRepository: InMemorySessionsRepository;

let mockedEncrypter: MockedEncrypter;
let mockedHasher: MockedHasher;

let sut: AuthenticateUseCase;

describe("authenticate", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    otpsRepository = new InMemoryOtpsRepository();
    sessionsRepository = new InMemorySessionsRepository();

    mockedEncrypter = new MockedEncrypter();
    mockedHasher = new MockedHasher();

    sut = new AuthenticateUseCase(
      usersRepository,
      otpsRepository,
      sessionsRepository,
      mockedEncrypter,
      mockedHasher,
    );
  });

  it("should be able to authenticate via basic auth", async () => {
    const password = await mockedEncrypter.encrypt("12345678");

    const user = makeUser({ password, verified_at: now() });

    await usersRepository.create(user);

    const result = await sut.execute({
      email: user.email,
      password: "12345678",
      agent: "browser",
      ip: "0.0.0.0",
      type: "BASIC",
    });

    expect(result.user).toBeInstanceOf(User);
    expect(result.token).toBeTypeOf("string");
    expect(sessionsRepository.items).toHaveLength(1);
  });

  it("should be able to authenticate via otp", async () => {
    const user = makeUser({ verified_at: now() });
    await usersRepository.create(user);

    const otp = makeOtp({ user_id: user.id, user });
    await otpsRepository.create(otp);

    const result = await sut.execute({
      email: user.email,
      password: otp.value,
      agent: "browser",
      ip: "0.0.0.0",
      type: "OTP",
    });

    expect(result.token).toBeTypeOf("string");
    expect(sessionsRepository.items).toHaveLength(1);
    expect(otpsRepository.items[0].used).toBe(true);
  });

  it("should not be able to authenticate with wrong basic credentials", async () => {
    const password = await mockedEncrypter.encrypt("12345678");

    const user = makeUser({ password, verified_at: now() });

    await usersRepository.create(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "8765421",
        agent: "browser",
        ip: "0.0.0.0",
        type: "BASIC",
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate with wrong otp credentials", async () => {
    const user = makeUser({ verified_at: now() });

    await usersRepository.create(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "8765421",
        agent: "browser",
        ip: "0.0.0.0",
        type: "OTP",
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not authenticate an unverifed user", async () => {
    const password = await mockedEncrypter.encrypt("12345678");

    const user = makeUser({ password });

    await usersRepository.create(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "12345678",
        agent: "browser",
        ip: "0.0.0.0",
        type: "BASIC",
      }),
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
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
});
