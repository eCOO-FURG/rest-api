// Use-cases
import { UpdateProducerUseCase } from "@/core/use-cases/update-producer";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists";

// Services
import { MockedStorage } from "@/test/storage/mocked-storage";
import { Storage as AppStorage } from "@/core/storage/storage";

// Factories
import { makeProducer } from "@/test/factories/make-producer";
import { makeUser } from "@/test/factories/make-user";
import { makeFile } from "@/test/factories/make-file";

let farmsRepository: InMemoryFarmsRepository;
let usersRepository: InMemoryUsersRepository;
let storage: MockedStorage;

let sut: UpdateProducerUseCase;

describe("update producer", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    usersRepository = new InMemoryUsersRepository();
    storage = new MockedStorage();

    sut = new UpdateProducerUseCase(
      farmsRepository,
      usersRepository,
      storage as unknown as AppStorage,
    );
  });

  it("should be able to update producer basic info", async () => {
    const producer = makeProducer();
    await farmsRepository.create(producer);

    await sut.execute({
      farm_id: producer.id.value,
      first_name: "Novo",
      last_name: "Nome",
      email: "novo@email.com",
      cpf: "00000000000",
      phone: "+5551987654321",
      name: "Fazenda Atualizada",
      tally: "TAL-123",
      chat: "@novo_chat",
      photo: makeFile(),
    });

    const updated = await farmsRepository.find("producer", { id: producer.id.value });

    expect(updated).toBeTruthy();
    expect(updated!.name).toBe("Fazenda Atualizada");
    expect(updated!.tally).toBe("TAL-123");
    expect(updated!.admin.first_name).toBe("Novo");
    expect(updated!.admin.last_name).toBe("Nome");
    expect(updated!.admin.email).toBe("novo@email.com");
    expect(updated!.admin.cpf.value).toBe("00000000000");
    expect(updated!.admin.phone.value).toBe("+5551987654321");
    expect(updated!.admin.chat).toBe("@novo_chat");
    expect(updated!.admin.photo).toContain("users");
  });

  it("should throw when producer not found", async () => {
    await expect(sut.execute({ farm_id: "non-existent-id", name: "X" })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it("should not allow updating to an email already used by another user", async () => {
    const other = makeUser({ email: "dup@email.com" });
    await usersRepository.create(other);

    const producer = makeProducer();
    await farmsRepository.create(producer);

    await expect(
      sut.execute({ farm_id: producer.id.value, email: "dup@email.com" }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not allow updating to a cpf already used by another user", async () => {
    const other = makeUser();
    await usersRepository.create(other);

    const producer = makeProducer();
    await farmsRepository.create(producer);

    await expect(
      sut.execute({ farm_id: producer.id.value, cpf: other.cpf.value }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not allow updating to a phone already used by another user", async () => {
    const other = makeUser();
    await usersRepository.create(other);

    const producer = makeProducer();
    await farmsRepository.create(producer);

    await expect(
      sut.execute({ farm_id: producer.id.value, phone: other.phone.value }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not allow updating to a tally already used by another producer", async () => {
    const duplicatedTally = "TALLY-XYZ";

    const otherProducer = makeProducer();
    otherProducer.tally = duplicatedTally;
    await farmsRepository.create(otherProducer);

    const producer = makeProducer();
    await farmsRepository.create(producer);

    await expect(
      sut.execute({ farm_id: producer.id.value, tally: duplicatedTally }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
