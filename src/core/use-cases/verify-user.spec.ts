// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { VerifyUserUsecase } from "@/core/use-cases/verify-user";

// Services
import { MockedHasher } from "@/test/cryptography/mocked-hasher";
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UserAlreadyVerified } from "@/core/errors/user-already-verified";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials";

let usersRepository: InMemoryUsersRepository;
let hasher: MockedHasher;

let sut: VerifyUserUsecase;

describe("Verify user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hasher = new MockedHasher();

    sut = new VerifyUserUsecase(usersRepository, hasher);
  });

  it("should be able verify a user", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const token = await hasher.hash({ user_id: user.id.value });

    await sut.execute({ token });

    expect(user.verified_at).not.toBeNull();
    expect(user.verified_at).toBeInstanceOf(Date);
  });

  it("should not be able verify with an invalid token", async () => {
    await expect(() => sut.execute({ token: "123" })).rejects.toBeInstanceOf(
      WrongCredentialsError
    );
  });

  it("should not be able verify a user if the user does not exist", async () => {
    const token = await hasher.hash({ user_id: "123" });

    await expect(() => sut.execute({ token })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });

  it("should not be able to be verified if the user is already verified", async () => {
    const user = makeUser({
      verified_at: new Date(),
    });
    await usersRepository.create(user);

    const token = await hasher.hash({ user_id: user.id.value });

    await expect(() => sut.execute({ token })).rejects.toBeInstanceOf(
      UserAlreadyVerified
    );
  });
});
