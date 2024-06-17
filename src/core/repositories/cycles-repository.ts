import { Cycle } from "@/core/entities/cycle";

export interface CyclesRepository {
  findById(id: string): Promise<Cycle | null>;
  create(cycle: Cycle): Promise<void>;
}
