// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Entities
import { Catalog } from "@/core/entities/catalog";

export interface CatalogsRepositorySearchRequest {
  id?: string;
  farm?: {
    id?: string;
    name?: string;
  };
  cycle?: {
    id?: string;
  };
  offers?: {
    id?: string;
    product?: { name?: string };
    page?: number;
  };
  since?: Date;
  before?: Date;
}

export interface CatalogsRepository {
  find(
    type: RepositoryResponse,
    filters: CatalogsRepositorySearchRequest
  ): Promise<Catalog | null>;
  list(
    type: RepositoryResponse,
    filters: CatalogsRepositorySearchRequest,
    page?: number
  ): Promise<Catalog[]>;
  create(catalog: Catalog): Promise<void>;
  update(catalog: Catalog): Promise<void>;
}
