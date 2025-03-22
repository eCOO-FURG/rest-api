// Entities
import { Catalog } from "@/core/entities/catalog";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";

export type CatalogRepositoryReturnType = "catalog" | "catalog-and-farm";

export type CatalogEntityOf<T extends CatalogRepositoryReturnType> =
  T extends "catalog"
    ? Catalog
    : T extends "catalog-and-farm"
    ? CatalogAndFarm
    : never;

export interface CatalogsRepositorySearchRequest {
  id?: string;
  farm?: { id?: string; name?: string };
  cycle?: { id?: string };
  offers?: {
    id?: string;
    product?: { name?: string };
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
