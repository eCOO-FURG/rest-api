// Entities
import { Farm } from "@/core/entities/farm";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

export interface FarmsRepositorySearchRequest {
  id?: string;
  caf?: string;
  name?: string;
  admin?: {
    id?: string;
  };
}

export type FarmsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Farm : FarmAggregate;

export interface FarmsRepository {
  search<T extends RepositoryResponse>(
    filters: FarmsRepositorySearchRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T> | null>;
  searchMany<T extends RepositoryResponse = "entity">(
    filters: { page: number; farm?: string },
    type?: T
  ): Promise<FarmsRepositoryResponse<T>[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
}
