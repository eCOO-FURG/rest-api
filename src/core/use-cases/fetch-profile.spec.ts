// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { FetchProfileUseCase } from "@/core/use-cases/fetch-profile";

// Services
import { makeUser } from "@/test/factories/make-user";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let sut: FetchProfileUseCase;

describe("Get user profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    sut = new FetchProfileUseCase(usersRepository);
  });

  it("should be able to get a user profile", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const response = await sut.execute({ user_id: user.id.value });

    expect(response).toHaveProperty("user");
  });

  it("should not be able to get a user profile if the user does not exist", async () => {
    await expect(() =>
      sut.execute({ user_id: "aaaaa" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
