// Entities
import { Market } from "@/core/entities/market";
import { MarketAndDetails } from "@/core/entities/aggregates/market-and-details";

export type MarketsRepositoryReturnType = "market" | "market-and-details";

export type MarketEntityOf<T extends MarketsRepositoryReturnType> = T extends "market"
  ? Market
  : T extends "market-and-details"
    ? MarketAndDetails
    : never;

export interface MarketsRepositorySearchRequest {
  id?: string;
  name?: string;
  open?: boolean;
}

export interface MarketsRepository {
  find<T extends MarketsRepositoryReturnType>(
    type: T,
    filters: MarketsRepositorySearchRequest,
  ): Promise<MarketEntityOf<T> | null>;
  list<T extends MarketsRepositoryReturnType>(
    type: T,
    filters: MarketsRepositorySearchRequest,
    page?: number,
  ): Promise<MarketEntityOf<T>[]>;
  create(market: Market): Promise<void>;
  update(market: Market): Promise<void>;
}
