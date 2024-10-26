// Entities
import { Bag } from "@/core/entities/bag";
import { BagAggregate } from "@/core/entities/aggregates/bag-aggregate";
import { BagMerge } from "@/core/entities/merged/bag-merge";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface BagsRepositorySearchRequest {
  id?: string;
  user?: { id?: string };
  cycle?: { id?: string };
  address?: { id?: string } | null;
  since?: Date;
}

export interface BagsRepositorySearchManyRequest {
  page?: number;
  name?: string;
  cycle?: {
    id?: string;
  };
  status?: Bag["status"][];
  since?: Date;
}

export type BagsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Bag : T extends "aggregate" ? BagAggregate : BagMerge;

export interface BagsRepository {
  search<T extends RepositoryResponse>(
    filters: BagsRepositorySearchRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T> | null>;
  searchMany<T extends RepositoryResponse>(
    filters: BagsRepositorySearchManyRequest,
    type: T
  ): Promise<BagsRepositoryResponse<T>[]>;
  create(bag: Bag): Promise<void>;
  update(bag: Bag): Promise<void>;
}
