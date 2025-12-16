// Libraries
import { Market as PrismaMarket } from "@prisma/client";

// Repositories
import {
  MarketEntityOf,
  MarketsRepositoryReturnType,
} from "@/core/repositories/markets-repository";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { MarketAndDetails } from "@/core/entities/aggregates/market-and-details";

export type PrismaMarketAndDetails = PrismaMarket & {
  offers_count: number;
  bags_count: number;
  revenue: number;
  fee: number;
};

export class PrismaMarketAndDetailsMapper {
  static toDomain<T extends MarketsRepositoryReturnType = "market-and-details">(
    raw: PrismaMarketAndDetails,
  ): MarketEntityOf<T> {
    return MarketAndDetails.create({
      id: new UUID(raw.id),
      name: raw.name,
      description: raw.description,
      open: raw.open,
      offers_count: raw.offers_count,
      bags_count: raw.bags_count,
      revenue: raw.revenue,
      fee: raw.fee,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as MarketEntityOf<T>;
  }
}
