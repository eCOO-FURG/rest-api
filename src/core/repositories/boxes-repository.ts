// Entities
import { Box } from "@/core/entities/box";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { BoxAggregate } from "@/core/entities/aggregates/box-aggregate";
import { BoxMerge } from "@/core/entities/merged/box-merge";

export interface BoxesRepositorySearchRequest {
  id?: string;
  status?: Box["status"];
  catalog?: { id: string; cycle?: { id?: string }; farm?: { name?: string } };
  since?: Date;
}

export interface BoxesRepositorySearchManyRequest
  extends BoxesRepositorySearchRequest {
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
  count(filters: BoxesRepositorySearchRequest): Promise<number>;
  create(box: Box): Promise<void>;
  update(box: Box): Promise<void>;
}
