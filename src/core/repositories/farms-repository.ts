// Entities
import { Farm, FarmStatus } from "@/core/entities/farm";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";

export type FarmRepositoryReturnType = "farm" | "farm-and-admin";

export type FarmEntityOf<T extends FarmRepositoryReturnType> = T extends "farm" ? Farm : T extends "farm-and-admin" ? FarmAndAdmin : never;

export interface FarmsRepositorySearchRequest {
  id?: string;
  tally?: string;
  name?: string;
  status?: FarmStatus;
  admin?: { id?: string };
}

export interface FarmsRepository {
  find<T extends FarmRepositoryReturnType>(type: T, filters: FarmsRepositorySearchRequest): Promise<FarmEntityOf<T> | null>;
  list<T extends FarmRepositoryReturnType>(type: T, filters: FarmsRepositorySearchRequest, page?: number): Promise<FarmEntityOf<T>[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
  count(filters: FarmsRepositorySearchRequest): Promise<number>;
}
