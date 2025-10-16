// Libraries
import { Prisma, Market as PrismaMarket } from "@prisma/client";

// Entities
import { Market } from "@/core/entities/market";
import { UUID } from "@/core/entities/aggregates/uuid";
import {
  MarketEntityOf,
  MarketsRepositoryReturnType,
} from "@/core/repositories/markets-repository";

export class PrismaMarketMapper {
  static toDomain<T extends MarketsRepositoryReturnType = "market">(
    raw: PrismaMarket,
  ): MarketEntityOf<T> {
    return Market.create({
      id: new UUID(raw.id),
      name: raw.name,
      description: raw.description,
      open: raw.open,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as MarketEntityOf<T>;
  }

  static toPrisma(market: Market): Prisma.MarketUncheckedCreateInput {
    return {
      id: market.id.value,
      name: market.name,
      description: market.description,
      open: market.open,
      created_at: market.created_at,
      updated_at: market.updated_at,
    };
  }
}
