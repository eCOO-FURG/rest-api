// Entities
import { Warehouse } from "@/core/entities/warehouse";

export interface WarehouseRepository {
  find(): Promise<Warehouse>;
  update(warehouse: Warehouse): Promise<void>;
}
