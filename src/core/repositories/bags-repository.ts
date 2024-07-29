// Entities
import { Bag } from "@/core/entities/bag";
import { BagAggregate } from "@/core/entities/value-objects/bag-aggregate";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface BagsRepositorySearchRequest {
  user_id?: string;
  cycle_id?: string;
  since?: Date;
}

export type BagsRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Bag : BagAggregate;

// export type BagsRepositoryManyResponse<T extends RepositoryResponse> =
//   T extends "entity" ? Bag[] : BagAggregate[];

export interface BagsRepository {
  findById<T extends RepositoryResponse = "entity">(
    id: string,
    type?: T
  ): Promise<BagsRepositoryResponse<T> | null>;
  search<T extends RepositoryResponse = "entity">(
    filter: BagsRepositorySearchRequest,
    type?: T
  ): Promise<BagsRepositoryResponse<T> | null>;
  create(bag: Bag): Promise<void>;
}
