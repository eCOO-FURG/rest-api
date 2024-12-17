// Entities
import { Bag } from "@/core/entities/bag";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface BagsRepositorySearchRequest {
  id?: string;
  statuses?: Bag["status"][];
  user?: { id?: string; name?: string };
  cycle?: { id?: string };
  address?: { id?: string } | null;
  orders?: { id?: string; page?: number };
  payments?: { id?: string; page?: number };
  withdraw?: boolean;
  since?: Date;
  before?: Date;
}

export interface BagsRepository {
  find(
    type: RepositoryResponse,
    filters: BagsRepositorySearchRequest
  ): Promise<Bag | null>;
  list(
    type: RepositoryResponse,
    filters: BagsRepositorySearchRequest,
    page?: number
  ): Promise<Bag[]>;
  create(bag: Bag): Promise<void>;
  update(bag: Bag): Promise<void>;
}
