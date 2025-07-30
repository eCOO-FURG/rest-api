// Entities
import { Cycle } from "@/core/entities/cycle";

export type CycleRepositoryReturnType = "cycle";

export type CycleEntityOf<T extends CycleRepositoryReturnType> =
  T extends "cycle" ? Cycle : never;

export interface CyclesRepositorySearchRequest {
  id?: string;
}

export interface CyclesRepository {
  find<T extends CycleRepositoryReturnType>(
    type: T,
    filters: CyclesRepositorySearchRequest,
  ): Promise<CycleEntityOf<T> | null>;
  list<T extends CycleRepositoryReturnType>(
    type: T,
    filters: CyclesRepositorySearchRequest,
    page?: number,
  ): Promise<CycleEntityOf<T>[]>;
}
