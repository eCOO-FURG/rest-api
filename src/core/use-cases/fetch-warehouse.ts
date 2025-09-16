// Repositories
import { WarehouseRepository } from "@/core/repositories/warehouse-repository";

export class FetchWarehouseUseCase {
  constructor(private warehouseRepository: WarehouseRepository) {}

  async execute() {
    return { warehouse: await this.warehouseRepository.find() };
  }
}
