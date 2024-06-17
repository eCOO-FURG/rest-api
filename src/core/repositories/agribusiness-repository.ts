// Entities
import { Agribusiness } from "../entities/agribusiness";

export interface AgribusinessRepository {
  findById(id: string): Promise<Agribusiness | null>;
  findByCaf(caf: string): Promise<Agribusiness | null>;
  findByAdminId(admin_id: string): Promise<Agribusiness | null>;
  save(agribusiness: Agribusiness): Promise<void>;
  update(agribusiness: Agribusiness): Promise<void>;
}
