// Repositories
import { InMemoryWarehouseRepository } from "@/test/repositories/in-memory-warehouse-repository";

// Use-cases
import { FetchWarehouseUseCase } from "@/core/use-cases/fetch-warehouse";

let warehouseRepository: InMemoryWarehouseRepository;
let sut: FetchWarehouseUseCase;

describe("Fetch warehouse", () => {
  beforeEach(() => {
    warehouseRepository = new InMemoryWarehouseRepository();
    sut = new FetchWarehouseUseCase(warehouseRepository);
  });

  it("should be able to fetch warehouse data", async () => {
    const response = await sut.execute();

    expect(response).toHaveProperty("warehouse");
  });

  it("should return warehouse instance", async () => {
    const response = await sut.execute();

    expect(response).toHaveProperty("warehouse");
    expect(response.warehouse).toBe(await warehouseRepository.find());
  });
});
