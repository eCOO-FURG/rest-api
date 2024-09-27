// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Entities
import { Catalog } from "@/core/entities/catalog";
import { CatalogAggregate } from "@/core/entities/aggregates/catalog-aggregate";
import { CatalogMerge } from "@/core/entities/merged/catalog-merge";

export interface CatalogsRepositorySearchRequest {
  id?: string;
  farm?: {
    id?: string;
    name?: string;
  };
  cycle?: {
    id?: string;
  };
  offer?: {
    product?: {
      name?: string;
    };
    page: number;
  };
  since?: Date;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
}

export interface CatalogsRepositorySearchManyRequest {
  cycle?: {
    id: string;
  };
  offer?: {
    product?: {
      name?: string;
    };
  };
  page?: number;
  since?: Date;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
}

export type CatalogsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity"
    ? Catalog
    : T extends "aggregate"
    ? CatalogAggregate
    : CatalogMerge;

export interface CatalogsRepository {
  search<T extends RepositoryResponse>(
    filters: CatalogsRepositorySearchRequest,
    type: T
  ): Promise<CatalogsRepositoryResponse<T> | null>;
  searchMany<T extends RepositoryResponse>(
    filters: CatalogsRepositorySearchManyRequest,
    type: T
  ): Promise<CatalogsRepositoryResponse<T>[]>;
  create(catalog: Catalog): Promise<void>;
}
