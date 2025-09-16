// Entities
import { Warehouse } from "@/core/entities/warehouse";

// Repositories
import { WarehouseRepository } from "@/core/repositories/warehouse-repository";

// Factories
import { makeWarehouse } from "@/test/factories/make-warehouse";

export class InMemoryWarehouseRepository implements WarehouseRepository {
  main: Warehouse;

  constructor() {
    this.main = makeWarehouse();
  }

  async find() {
    return this.main;
  }

  async update(warehouse: Warehouse) {
    this.main = warehouse;
  }
}
