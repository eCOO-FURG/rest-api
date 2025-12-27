// Entities
import { Merchandise } from "@/core/entities/aggregates/merchandise";
import { OfferAndProduct } from "@/core/entities/aggregates/offer-and-product";
import { Offer } from "@/core/entities/offer";
import { BagSource } from "../entities/bag";

export type OfferRepositoryReturnType = "offer" | "offer-and-product" | "merchandise";

export type OfferEntityOf<T extends OfferRepositoryReturnType> = T extends "offer"
  ? Offer
  : T extends "offer-and-product"
    ? OfferAndProduct
    : T extends "merchandise"
      ? Merchandise
      : never;

export interface OffersRepositorySearchRequest {
  id?: string;
  ids?: string[];
  cycle?: { id?: string };
  farm?: { id?: string; name?: string };
  market?: { id?: string; name?: string };
  product?: { id?: string; name?: string; category?: { id?: string } };
  recurring?: boolean;
  active?: boolean;
  available?: BagSource;
  since?: Date;
  before?: Date;
}

export interface OffersRepository {
  find<T extends OfferRepositoryReturnType>(
    type: T,
    filters: OffersRepositorySearchRequest,
  ): Promise<OfferEntityOf<T> | null>;
  list<T extends OfferRepositoryReturnType>(
    type: T,
    filters: OffersRepositorySearchRequest,
    page?: number,
  ): Promise<OfferEntityOf<T>[]>;
  create(offer: Offer): Promise<void>;
  update(offer: Offer): Promise<void>;
  delete(offer: Offer): Promise<void>;
  publishCycleOnMarket(cycle_id: string, market_id: string): Promise<void>;
}
