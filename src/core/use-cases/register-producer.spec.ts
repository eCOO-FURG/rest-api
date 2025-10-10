// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Use-cases
import { RegisterUseCase } from "@/core/use-cases/register";
import { RegisterFarmUseCase } from "@/core/use-cases/register-farm";
import { RegisterProducerUseCase } from "@/core/use-cases/register-producer";

// Errors
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeUser } from "@/test/factories/make-user";

// Entities
import { CPF } from "@/core/entities/cpf";

// Services
import { MockedEncrypter } from "@/test/cryptography/mocked-encrypter";
import { MockedHasher } from "@/test/cryptography/mocked-hasher";
import { MockedMailer } from "@/test/mail/mocked-mailer";
import { MockedStorage } from "@/test/storage/mocked-storage";

let usersRepository: InMemoryUsersRepository;
let farmsRepository: InMemoryFarmsRepository;
let encrypter: MockedEncrypter;
let hasher: MockedHasher;
let storage: MockedStorage;
let mailer: MockedMailer;

let registerUseCase: RegisterUseCase;
let registerFarmUseCase: RegisterFarmUseCase;
let sut: RegisterProducerUseCase;

describe("register producer", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    farmsRepository = new InMemoryFarmsRepository();
    encrypter = new MockedEncrypter();
    hasher = new MockedHasher();
    storage = new MockedStorage();
    mailer = new MockedMailer();

    registerUseCase = new RegisterUseCase(
      usersRepository,
      encrypter,
      hasher,
      storage,
      mailer,
    );

    registerFarmUseCase = new RegisterFarmUseCase(
      usersRepository,
      farmsRepository,
    );

    sut = new RegisterProducerUseCase(
      usersRepository,
      registerUseCase,
      registerFarmUseCase,
    );
  });

  it("should be able to register a producer", async () => {
    await sut.execute({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      cpf: "12345678901",
      phone: "11999999999",
      name: "Fazenda Feliz",
      tally: "12345678",
    });

    expect(usersRepository.items).toHaveLength(2);
    expect(farmsRepository.items).toHaveLength(1);
    expect(usersRepository.items[1].first_name).toBe("John");
    expect(farmsRepository.items[0].name).toBe("Fazenda Feliz");
  });

  it("should not register a producer with duplicate email", async () => {
    const existingUser = makeUser({ email: "john@example.com" });
    await usersRepository.create(existingUser);

    await expect(() =>
      sut.execute({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        cpf: "12345678901",
        phone: "11999999999",
        name: "Fazenda Feliz",
        tally: "12345678",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not register a producer with duplicate CPF", async () => {
    const existingUser = makeUser({ cpf: new CPF("12345678901") });
    await usersRepository.create(existingUser);

    await expect(() =>
      sut.execute({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        cpf: "12345678901",
        phone: "11999999999",
        name: "Fazenda Feliz",
        tally: "12345678",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not register a producer with duplicate tally", async () => {
    const producer = makeUser({ roles: ["USER", "PRODUCER"] });
    await usersRepository.create(producer);

    const existingFarm = makeFarm({
      admin_id: producer.id,
      tally: "12345678",
      name: "Fazenda Existente",
    });
    await farmsRepository.create(existingFarm);

    await expect(() =>
      sut.execute({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        cpf: "12345678901",
        phone: "11999999999",
        name: "Fazenda Feliz",
        tally: "12345678",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should rollback user creation if farm registration fails", async () => {
    const existingProducer = makeUser({ roles: ["USER", "PRODUCER"] });
    await usersRepository.create(existingProducer);

    const farm = makeFarm({
      admin_id: existingProducer.id,
      tally: "12345678",
      name: "Fazenda Existente",
    });
    await farmsRepository.create(farm);

    const initialUserCount = usersRepository.items.length;

    await expect(() =>
      sut.execute({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        cpf: "12345678901",
        phone: "11999999999",
        name: "Fazenda Nova",
        tally: "12345678",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);

    expect(usersRepository.items).toHaveLength(initialUserCount);
  });
});
