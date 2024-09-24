// Entities
import { Offer } from "@/core/entities/offer";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";
import { OfferAggregate } from "@/core/entities/aggregates/offer-aggregate";
import { OfferMerge } from "@/core/entities/merged/offer-merge";

export interface OffersRepositorySearchRequest {
  id?: string;
  catalog?: {
    id?: string;
  };
  product?: { id?: string; name?: string };
  since?: Date;
}

export interface OffersRepositorySearchManyRequest {
  ids?: string[];
  catalog?: {
    id?: string;
  };
  product?: { name?: string };
  page?: number;
  since?: Date;
  before?: Date;
}

export type OffersRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity"
    ? Offer
    : T extends "aggregate"
    ? OfferAggregate
    : OfferMerge;

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
