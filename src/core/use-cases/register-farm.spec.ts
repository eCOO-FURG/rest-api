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

// Mocks
import { uploadImage } from "@/infra/image/upload";

vi.mock("@/infra/image/upload", () => ({
  uploadImage: vi
    .fn()
    .mockResolvedValue("http://example.com/fake-image-url.jpg"),
}));

let usersRepository: InMemoryUsersRepository;

let repositories: {
  users: InMemoryUsersRepository;
  farm: InMemoryFarmsRepository;
};

let sut: RegisterFarmUseCase;

describe("create farm", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    repositories = {
      users: usersRepository,
      farm: new InMemoryFarmsRepository(usersRepository),
    };

    sut = new RegisterFarmUseCase(repositories.users, repositories.farm);
  });

  it("should be able to create an farm", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    await sut.execute({
      user_id: user.id.value,
      tally: "12345678",
      name: "Fazenda Feliz",
      image: Buffer.from("fake-image-buffer"),
    });

    expect(uploadImage).toHaveBeenCalledWith(Buffer.from("fake-image-buffer"));
  });

  it("should not be able to create two farms with the same tally", async () => {
    const user1 = makeUser();
    await repositories.users.create(user1);

    const user2 = makeUser();
    await repositories.users.create(user2);

    const tally = "12345678";

    const farm = Farm.create({
      admin_id: user1.id,
      tally,
      name: "Fazenda Triste",
      image_url: "",
    });

    await repositories.farm.create(farm);

    await expect(() =>
      sut.execute({
        user_id: user2.id.value,
        tally,
        name: "Fazenda Melancólica",
        image: Buffer.from("fake-image-buffer"),
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to create two farms with the same admin", async () => {
    const user = makeUser();
    await repositories.users.create(user);

    const farm = Farm.create({
      admin_id: user.id,
      tally: "12345678",
      name: "Fazenda Triste",
      image_url: "",
    });

    await repositories.farm.create(farm);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        tally: "34567890",
        name: "Fazenda Alegre",
        image: Buffer.from("fake-image-buffer"),
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
