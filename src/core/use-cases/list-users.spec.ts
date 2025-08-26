// Entities
import { User } from "@/core/entities/user";

// Use-cases
import { ListUsersUseCase } from "@/core/use-cases/list-users";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Factories
import { makeUser } from "@/test/factories/make-user";

let usersRepository: InMemoryUsersRepository;
let sut: ListUsersUseCase;

describe("list users", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ListUsersUseCase(usersRepository);
  });

  it("should return a list of users", async () => {
    const user1 = makeUser({ first_name: "John", last_name: "Doe" });
    const user2 = makeUser({ first_name: "Jane", last_name: "Smith" });

    await usersRepository.create(user1);
    await usersRepository.create(user2);

    const result = await sut.execute({ page: 1 });

    expect(result.users).toHaveLength(2);
    expect(result.users[0]).toBeInstanceOf(User);
    expect(result.users[1]).toBeInstanceOf(User);
  });

  it("should filter users by first_name and last_name", async () => {
    const user1 = makeUser({ first_name: "Alice", last_name: "Johnson" });
    const user2 = makeUser({ first_name: "Bob", last_name: "Johnson" });

    await usersRepository.create(user1);
    await usersRepository.create(user2);

    const result = await sut.execute({
      page: 1,
      first_name: "Alice",
      last_name: "Johnson",
    });

    expect(result.users).toHaveLength(1);
    expect(result.users[0].first_name).toBe("Alice");
    expect(result.users[0].last_name).toBe("Johnson");
  });

  it("should filter users by roles", async () => {
    const user1 = makeUser({ roles: ["USER"] });
    const user2 = makeUser({ roles: ["USER", "BROKER"] });
    const user3 = makeUser({ roles: ["MANAGER"] });

    await usersRepository.create(user1);
    await usersRepository.create(user2);
    await usersRepository.create(user3);

    const result = await sut.execute({ page: 1, roles: ["USER"] });

    expect(result.users).toHaveLength(2);
    expect(
      result.users.map((u) => u.roles.includes("USER")).every(Boolean),
    ).toBe(true);
  });

  it("should return empty array when no user matches", async () => {
    const result = await sut.execute({ page: 1, first_name: "NonExisting" });
    expect(result.users).toHaveLength(0);
  });
});
