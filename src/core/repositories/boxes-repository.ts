// Entities
import { Box } from "@/core/entities/box";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface BoxesRepositorySearchRequest {
  id?: string;
  status?: Box["status"];
  catalog?: {
    id?: string;
    farm?: { id?: string; name?: string };
    cycle?: { id?: string };
  };
  orders?: { page?: number };
  since?: Date;
  before?: Date;
}

export interface BoxesRepository {
  find(
    type: RepositoryResponse,
    filters: BoxesRepositorySearchRequest
  ): Promise<Box | null>;
  list(
    type: RepositoryResponse,
    filters: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<Box[]>;
  count(filters: BoxesRepositorySearchRequest): Promise<number>;
  create(box: Box): Promise<void>;
  update(box: Box): Promise<void>;
}
