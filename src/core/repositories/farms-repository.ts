// Entities
import { Farm } from "@/core/entities/farm";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { FarmAggregate } from "../entities/aggregates/farm-aggregate";

export interface FarmsRepositoryFindManyWithActiveOfferRequest {
  cycle_id: string;
  created_at: Date;
  page: number;
  product?: string;
}

export interface FarmsRepositorySearchManyWithOrdersRequest {
  cycle_id: string;
  page: number;
  name?: string;
}

export interface FarmsRepositorySearchRequest {
  id?: string;
  caf?: string;
  admin_id?: string;
}

export type FarmsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Farm : FarmAggregate;

export interface FarmsRepository {
  search<T extends RepositoryResponse>(
    filters: FarmsRepositorySearchRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T> | null>;
  findManyWithActiveOffer({
    cycle_id,
    page,
    product,
    created_at,
  }: FarmsRepositoryFindManyWithActiveOfferRequest): Promise<Farm[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
  searchManyWithOrders({
    cycle_id,
    page,
    name,
  }: FarmsRepositorySearchManyWithOrdersRequest): Promise<Farm[]>;
}
