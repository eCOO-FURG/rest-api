// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { ListFarmsUseCase } from "@/core/use-cases/list-farms";

// Services
import { makeUser } from "@/test/factories/make-user";
import { makeFarm } from "@/test/factories/make-farm";

let farmsRepository: InMemoryFarmsRepository;
let usersRepository: InMemoryUsersRepository;

let sut: ListFarmsUseCase;

describe("list farms", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository(usersRepository);
    sut = new ListFarmsUseCase(farmsRepository);
  });

  it("should be able to list farms", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const farm1 = makeFarm({ admin_id: user.id });
    await farmsRepository.create(farm1);

    const response = await sut.execute({
      page: 1,
    });

    expect(response.farms).toHaveLength(1);
  });
});
