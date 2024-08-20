// Entities
import { Farm } from "@/core/entities/farm";
import { FarmAggregate } from "@/core/entities/value-objects/farm-aggregate";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

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

export type FarmsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Farm : FarmAggregate;
export interface FarmsRepository {
  findById(id: string): Promise<Farm | null>;
  findByCaf(caf: string): Promise<Farm | null>;
  findByAdminId(admin_id: string): Promise<Farm | null>;
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
  searchMany<T extends RepositoryResponse = "entity">(
    filters: { page: number; name?: string },
    type?: T
  ): Promise<FarmsRepositoryResponse<T>[]>;
}
