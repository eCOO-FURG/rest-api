// Entities
import { Farm, FarmStatus } from "@/core/entities/farm";
import { Producer } from "@/core/entities/aggregates/producer";
import { Catalog } from "@/core/entities/aggregates/catalog";
import { BagSource } from "@/core/entities/bag";

export type FarmRepositoryReturnType = "farm" | "producer" | "catalog";

export type FarmEntityOf<T extends FarmRepositoryReturnType> = T extends "farm"
  ? Farm
  : T extends "producer"
    ? Producer
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
    cycle?: { id?: string | null };
    market?: { id?: string | null };
    page?: number;
    remaining?: boolean;
    available?: BagSource;
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
