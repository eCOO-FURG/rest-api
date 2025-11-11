// Use-cases
import { RegisterProducerUseCase } from "@/core/use-cases/register-producer";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { MockedStorage } from "@/test/storage/mocked-storage";

// Factories
import { makeUser } from "@/test/factories/make-user";
import { makeFile } from "@/test/factories/make-file";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let storage: MockedStorage;

let sut: RegisterProducerUseCase;

describe("register producer", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository();
    storage = new MockedStorage();

    sut = new RegisterProducerUseCase(usersRepository, farmsRepository, storage);
  });

  it("should register a new producer and upload photo", async () => {
    await sut.execute({
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      cpf: "12345678900",
      phone: "+5551999999999",
      name: "Fazenda JD",
      tally: "TAL-001",
      chat: "@johndoe",
      photo: makeFile(),
    });

    const producer = await farmsRepository.find("producer", { tally: "TAL-001" });

    if (!producer) {
      throw new ResourceNotFoundError("Producer", "TAL-001");
    }

    expect(producer).toBeTruthy();
    expect(producer.admin.roles).toEqual(["USER", "PRODUCER"]);
    expect(producer.admin.phone.value).toBe("+5551999999999");
    expect(producer.admin.cpf.value).toBe("12345678900");
    expect(producer.admin.chat).toBe("@johndoe");
    expect(producer.admin.photo).toBeTruthy();
    expect(producer.admin.photo!).toContain("users");
  });

  it("should not allow duplicate email", async () => {
    const existing = makeUser({ email: "dup@e.com" });
    await usersRepository.create(existing);

    await expect(
      sut.execute({
        first_name: "A",
        last_name: "B",
        email: "dup@e.com",
        cpf: "11111111111",
        phone: "+555111111111",
        name: "Fazenda",
        tally: "TAL-002",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not allow duplicate phone", async () => {
    const existing = makeUser();
    await usersRepository.create(existing);

    await expect(
      sut.execute({
        first_name: "A",
        last_name: "B",
        email: "new@e.com",
        cpf: "11111111112",
        phone: existing.phone.value,
        name: "Fazenda",
        tally: "TAL-003",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not allow duplicate cpf", async () => {
    const existing = makeUser();
    await usersRepository.create(existing);

    await expect(
      sut.execute({
        first_name: "A",
        last_name: "B",
        email: "new2@e.com",
        cpf: existing.cpf.value,
        phone: "+555111111113",
        name: "Fazenda",
        tally: "TAL-004",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not allow duplicate chat handle", async () => {
    const existing = makeUser({ chat: "@dup" });
    await usersRepository.create(existing);

    await expect(
      sut.execute({
        first_name: "A",
        last_name: "B",
        email: "new3@e.com",
        cpf: "11111111114",
        phone: "+555111111114",
        name: "Fazenda",
        tally: "TAL-005",
        chat: "@dup",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not allow duplicate tally for farms", async () => {
    // Create a producer with a tally already in use
    await sut.execute({
      first_name: "X",
      last_name: "Y",
      email: "x@y.com",
      cpf: "22222222222",
      phone: "+555122222222",
      name: "Fazenda XY",
      tally: "TAL-006",
    });

    await expect(
      sut.execute({
        first_name: "Z",
        last_name: "W",
        email: "z@w.com",
        cpf: "33333333333",
        phone: "+555133333333",
        name: "Outra",
        tally: "TAL-006",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
