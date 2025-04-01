// Entities
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";
import { CatalogAndOffers } from "@/core/entities/aggregates/catalog-and-offers";
import { Catalog } from "@/core/entities/catalog";

export type CatalogRepositoryReturnType =
  | "catalog"
  | "catalog-and-farm"
  | "catalog-and-offers";

export type CatalogEntityOf<T extends CatalogRepositoryReturnType> =
  T extends "catalog"
    ? Catalog
    : T extends "catalog-and-farm"
    ? CatalogAndFarm
    : T extends "catalog-and-offers"
    ? CatalogAndOffers
    : never;

export interface CatalogsRepositorySearchRequest {
  id?: string;
  farm?: { id?: string; name?: string };
  cycle?: { id?: string };
  offers?: {
    id?: string;
    product?: { name?: string; category?: { id?: string } };
    page?: number;
    expired?: boolean;
  };
  since?: Date;
  before?: Date;
}

export interface CatalogsRepository {
  find<T extends CatalogRepositoryReturnType>(
    type: T,
    filters: CatalogsRepositorySearchRequest
  ): Promise<CatalogEntityOf<T> | null>;
  list<T extends CatalogRepositoryReturnType>(
    type: T,
    filters: CatalogsRepositorySearchRequest,
    page?: number
  ): Promise<CatalogEntityOf<T>[]>;
  create(catalog: Catalog): Promise<void>;
  update(catalog: Catalog): Promise<void>;
}
