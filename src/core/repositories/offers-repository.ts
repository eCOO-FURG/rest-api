// Entities
import { Offer } from "@/core/entities/offer";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { OfferAggregate } from "@/core/entities/aggregates/offer-aggregate";

export interface OffersRepositorySearchRequest {
  id?: string;
  cycle_id?: string;
  product_id?: string;
  farm_id?: string;
  since?: Date;
}

export interface OffersRepositorySearchManyRequest {
  ids?: string[];
  cycle_id?: string;
  farm_id?: string;
  since?: Date;
  product?: {
    name: string;
  };
  page?: number;
}

export type OffersRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Offer : OfferAggregate;

export interface OffersRepository {
  search<T extends RepositoryResponse>(
    filters: OffersRepositorySearchRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T> | null>;
  searchMany<T extends RepositoryResponse>(
    filters: OffersRepositorySearchManyRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T>[]>;
  create(offer: Offer): Promise<void>;
  update(offer: Offer): Promise<void>;
  delete(offer: Offer): Promise<void>;
}
