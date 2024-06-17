// Entities
import { Farm } from "../entities/farm";

export interface FarmsRepository {
  findById(id: string): Promise<Farm | null>;
  findByCaf(caf: string): Promise<Farm | null>;
  findByAdminId(admin_id: string): Promise<Farm | null>;
  save(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
}
