// Entities
import { Box, BoxStatus } from "@/core/entities/box";
import { BoxAndCatalog } from "@/core/entities/aggregates/box-and-catalog";

export type BoxRepositoryReturnType = "box" | "box-and-catalog";

export type BoxEntityOf<T extends BoxRepositoryReturnType> = T extends "box"
  ? Box
  : T extends "box-and-catalog"
  ? BoxAndCatalog
  : never;

export interface BoxesRepositorySearchRequest {
  id?: string;
  status?: BoxStatus;
  catalog?: {
    id?: string;
    farm?: { id?: string; name?: string };
    cycle?: { id?: string };
  };
  orders?: { page?: number };
  since?: Date;
  before?: Date;
}

export interface BoxesRepository {
  find<T extends BoxRepositoryReturnType>(
    type: T,
    filters: BoxesRepositorySearchRequest
  ): Promise<BoxEntityOf<T> | null>;
  list<T extends BoxRepositoryReturnType>(
    type: T,
    filters: BoxesRepositorySearchRequest,
    page?: number
  ): Promise<BoxEntityOf<T>[]>;
  count(filters: BoxesRepositorySearchRequest): Promise<number>;
  create(box: Box): Promise<void>;
  update(box: Box): Promise<void>;
}
