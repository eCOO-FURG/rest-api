// Use-cases
import { UpdateFarmUseCase } from "./update-farm";

// Repositories
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";

// Services
import { makeFarm } from "@/test/factories/make-farm";
import { MockedStorage } from "@/test/storage/mocked-storage";
import { makeFile } from "@/test/factories/make-file";

let farmsRepository: InMemoryFarmsRepository;
let storage: MockedStorage;

let sut: UpdateFarmUseCase;

describe("update user", () => {
  beforeEach(() => {
    farmsRepository = new InMemoryFarmsRepository();
    storage = new MockedStorage();

    sut = new UpdateFarmUseCase(farmsRepository, storage);
  });

  it("should be able to update more than one farm field", async () => {
    const farm = makeFarm({
      images: new Map([["image1", "image1"]]),
    });

    await farmsRepository.create(farm);

    await sut.execute({
      farm_id: farm.id.value,
      name: "Cláudio",
      tally: "123456",
      description: "Descrição",
      photo: makeFile(),
      images: { add: [makeFile()] },
    });

    expect(farmsRepository.items[0].name).toEqual("Cláudio");
    expect(farmsRepository.items[0].tally).toEqual("123456");
    expect(farmsRepository.items[0].description).toEqual("Descrição");
    expect(farmsRepository.items[0].photo).toBeTruthy();
    expect(farmsRepository.items[0].images.size).toEqual(1);
  });
});
