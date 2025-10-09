// Entities
import { Farm, FarmStatus } from "@/core/entities/farm";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";
import { Catalog } from "@/core/entities/aggregates/catalog";

export type FarmRepositoryReturnType = "farm" | "farm-and-admin" | "catalog";

export type FarmEntityOf<T extends FarmRepositoryReturnType> = T extends "farm"
  ? Farm
  : T extends "farm-and-admin"
    ? FarmAndAdmin
    : T extends "catalog"
      ? Catalog
      : never;

export interface FarmsRepositorySearchRequest {
  id?: string;
  tally?: string;
  name?: string;
  status?: FarmStatus;
  admin?: { id?: string };
  offers?: {
    id?: string;
    cycle?: { id?: string };
    page?: number;
    available?: boolean;
    remaining?: boolean;
    since?: Date;
    before?: Date;
    product?: { name?: string; category?: { id?: string } };
    period?: {
      since?: Date;
      before?: Date;
    };
  };
}

export interface FarmsRepository {
  find<T extends FarmRepositoryReturnType>(
    type: T,
    filters: FarmsRepositorySearchRequest,
  ): Promise<FarmEntityOf<T> | null>;
  list<T extends FarmRepositoryReturnType>(
    type: T,
    filters: FarmsRepositorySearchRequest,
    page?: number,
  ): Promise<FarmEntityOf<T>[]>;
  create(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<void>;
  count(filters: FarmsRepositorySearchRequest): Promise<number>;
}
