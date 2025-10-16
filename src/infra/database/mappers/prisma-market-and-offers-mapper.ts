// Libraries
import { Market as PrismaMarket } from "@prisma/client";

// Repositories
import {
  MarketEntityOf,
  MarketsRepositoryReturnType,
} from "@/core/repositories/markets-repository";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { MarketAndOffers } from "@/core/entities/aggregates/market-and-offers";

// Mappers
import {
  PrismaOfferAndDetailsMapper,
  PrismaOfferAndDetails,
} from "@/infra/database/mappers/prisma-offer-and-details-mapper";

export type PrismaMarketAndOffers = PrismaMarket & {
  offers: PrismaOfferAndDetails[];
};

export class PrismaMarketAndOffersMapper {
  static toDomain<T extends MarketsRepositoryReturnType = "market-and-offers">(
    raw: PrismaMarketAndOffers,
  ): MarketEntityOf<T> {
    return MarketAndOffers.create({
      id: new UUID(raw.id),
      name: raw.name,
      description: raw.description,
      open: raw.open,
      offers: raw.offers.map(PrismaOfferAndDetailsMapper.toDomain),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as MarketEntityOf<T>;
  }
}
