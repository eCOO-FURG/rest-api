// Entities
import { Farm } from "@/core/entities/farm";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface FarmsRepositorySearchRequest {
  id?: string;
  tally?: string;
  name?: string;
  status?: "ACTIVE" | "INACTIVE" | "PENDING";
  admin?: { id?: string };
}

export interface FarmsRepository {
  find(
    type: RepositoryResponse,
    filters: FarmsRepositorySearchRequest
  ): Promise<Farm | null>;
  list(
    type: RepositoryResponse,
    filters: FarmsRepositorySearchRequest,
    page?: number
  ): Promise<Farm[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
  count(filters: FarmsRepositorySearchRequest): Promise<number>;
}
