// Entities
import { Box } from "@/core/entities/box";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { BoxAggregate } from "@/core/entities/aggregates/box-aggregate";
import { BoxMerge } from "@/core/entities/merged/box-merge";

export interface BoxesRepositorySearchRequest {
  id?: string;
  catalog?: {
    id?: string;
    farm_id?: string;
  };
  since?: Date;
}

export interface BoxesRepositorySearchManyRequest {
  catalog?: {
    cycle?: {
      id?: string;
    };
    farm?: {
      name?: string;
    };
  };
  page?: number;
}

export type BoxesRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Box : T extends "aggregate" ? BoxAggregate : BoxMerge;

export interface BoxesRepository {
  search<T extends RepositoryResponse>(
    filters: BoxesRepositorySearchRequest,
    type: T
  ): Promise<BoxesRepositoryResponse<T> | null>;
  searchMany<T extends RepositoryResponse>(
    filters: BoxesRepositorySearchManyRequest,
    type: T
  ): Promise<BoxesRepositoryResponse<T>[]>;
  create(box: Box): Promise<void>;
  update(box: Box): Promise<void>;
}
