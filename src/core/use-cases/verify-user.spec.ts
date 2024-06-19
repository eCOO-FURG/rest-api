// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { VerifyUserUsecase } from "./verify-user";

// Services
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UserAlreadyVerified } from "@/core/errors/user-already-verified";

let usersRepository: InMemoryUsersRepository;

let sut: VerifyUserUsecase

describe("Verify user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new VerifyUserUsecase(
      usersRepository
    )
  })

  it("should be able to verify a user", async () => {
    const user = makeUser({
      verified_at: null
    })
    await usersRepository.create(user)

    await sut.execute({
      user_id: user.id.value
    })

    expect(user?.verified_at).not.toBeNull();
    expect(user?.verified_at).toBeInstanceOf(Date);
  })

  it("should not be able verify a user if the user does not exist", async () => {
    await expect(() => 
      sut.execute({
        user_id: '1234',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able verify a user if the user is already virified", async () => {
    const user = makeUser({
      verified_at: new Date()
    })
    await usersRepository.create(user)

    await expect(() => 
      sut.execute({
        user_id: user.id.value,
      })
    ).rejects.toBeInstanceOf(UserAlreadyVerified)
  })
})