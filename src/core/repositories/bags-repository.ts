// Entities
import { Bag } from "@/core/entities/bag";

export interface BagsRepositorySearchRequest {
  user_id?: string;
  cycle_id?: string;
  since?: Date;
}

export interface BagsRepository {
  create(bag: Bag): Promise<void>;
  search(filter: BagsRepositorySearchRequest): Promise<Bag | null>;
}
