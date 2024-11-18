// Entities
import { Farm } from "@/core/entities/farm";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

export interface FarmsRepositorySearchRequest {
  id?: string;
  tally?: string;
  name?: string;
  status?: "ACTIVE" | "INACTIVE" | "PENDING";
  admin?: { id?: string };
}
export interface FarmsRepositorySearchManyRequest
  extends FarmsRepositorySearchRequest {
  page: number;
}

export type FarmsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Farm : FarmAggregate;

export interface FarmsRepository {
  search<T extends RepositoryResponse>(
    filters: FarmsRepositorySearchRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T> | null>;
  searchMany<T extends RepositoryResponse>(
    filters: FarmsRepositorySearchManyRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T>[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
  count(filters: FarmsRepositorySearchRequest): Promise<number>;
  findById(id: string): Promise<Farm | null>;
}
