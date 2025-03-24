// Entities
import { Offer } from "@/core/entities/offer";
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";

export type OfferRepositoryReturnType = "offer" | "offer-and-product";

export type OfferEntityOf<T extends OfferRepositoryReturnType> =
  T extends "offer"
    ? Offer
    : T extends "offer-and-product"
    ? OfferAndProduct
    : never;

export interface OffersRepositorySearchRequest {
  id?: string;
  ids?: string[];
  catalog?: { id?: string };
  product?: { id?: string; name?: string };
  since?: Date;
  before?: Date;
}

export interface OffersRepository {
  find<T extends OfferRepositoryReturnType>(
    type: T,
    filters: OffersRepositorySearchRequest
  ): Promise<OfferEntityOf<T> | null>;
  list<T extends OfferRepositoryReturnType>(
    type: T,
    filters: OffersRepositorySearchRequest,
    page?: number
  ): Promise<OfferEntityOf<T>[]>;
  update(offer: Offer): Promise<void>;
  delete(offer: Offer): Promise<void>;
}
