// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { makeUser } from "@/test/factories/make-user";

// Entities
import { Farm } from "@/core/entities/farm";

let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;

let sut: RegisterFarmUseCase;

describe("create farm", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository();

    sut = new RegisterFarmUseCase(usersRepository, farmsRepository);
  });

  it("should be able to create an farm", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    await sut.execute({
      user_id: user.id.value,
      tally: "12345678",
      name: "Fazenda Feliz",
    });
  });

  it("should not be able to create two farms with the same tally", async () => {
    const user1 = makeUser();
    await usersRepository.create(user1);

    const user2 = makeUser();
    await usersRepository.create(user2);

    const tally = "12345678";

    const farm = Farm.create({
      admin_id: user1.id,
      tally,
      name: "Fazenda Triste",
    });

    await farmsRepository.create(farm);

    await expect(() =>
      sut.execute({
        user_id: user2.id.value,
        tally,
        name: "Fazenda Melancólica",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to create two farms with the same admin", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm = Farm.create({
      admin_id: user.id,
      tally: "12345678",
      name: "Fazenda Triste",
    });

    await farmsRepository.create(farm);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        tally: "34567890",
        name: "Fazenda Alegre",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
