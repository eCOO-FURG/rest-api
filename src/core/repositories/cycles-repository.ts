// Entities
import { Cycle } from "@/core/entities/cycle";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface CyclesRepositorySearchRequest {
  id?: string;
}

export interface CyclesRepository {
  find(
    type: RepositoryResponse,
    filters: CyclesRepositorySearchRequest
  ): Promise<Cycle | null>;
  list(
    type: RepositoryResponse,
    filters: CyclesRepositorySearchRequest,
    page?: number
  ): Promise<Cycle[]>;
}
