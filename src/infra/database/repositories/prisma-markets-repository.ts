// Entities
import { Market } from "@/core/entities/market";

// Repositories
import {
  MarketsRepositoryReturnType,
  MarketEntityOf,
  MarketsRepository,
  MarketsRepositorySearchRequest,
} from "@/core/repositories/markets-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaMarketMapper } from "@/infra/database/mappers/prisma-market-mapper";
import { PrismaMarketAndDetailsMapper } from "@/infra/database/mappers/prisma-market-and-details-mapper";

export class PrismaMarketsRepository implements MarketsRepository {
  async find<T extends MarketsRepositoryReturnType>(
    type: T,
    { id, name, open }: MarketsRepositorySearchRequest,
  ): Promise<MarketEntityOf<T> | null> {
    const market = await prisma.market.findFirst({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        open,
      },
    });

    if (!market) {
      return null;
    }

    switch (type) {
      default:
        return PrismaMarketMapper.toDomain<T>(market);
      case "market-and-details": {
        const [offers_total, bags_total] = await Promise.all([
          prisma.offer.count({
            where: { market_id: market.id },
          }),
          prisma.order.count({
            where: { offer: { market_id: market.id } },
          }),
        ]);

        return PrismaMarketAndDetailsMapper.toDomain<T>({
          ...market,
          offers_total,
          bags_total,
        });
      }
    }
  }

  async list<T extends MarketsRepositoryReturnType>(
    type: T,
    { id, name, open }: MarketsRepositorySearchRequest,
    page?: number,
  ): Promise<MarketEntityOf<T>[]> {
    const markets = await prisma.market.findMany({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        open,
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
      orderBy: { created_at: "desc" },
    });

    switch (type) {
      default:
        return markets.map(PrismaMarketMapper.toDomain<T>);
      case "market-and-details":
        return await Promise.all(
          markets.map(async (market) => {
            const [offers_total, bags_total] = await Promise.all([
              prisma.offer.count({
                where: { market_id: market.id },
              }),
              prisma.order.count({
                where: { offer: { market_id: market.id } },
              }),
            ]);

            return PrismaMarketAndDetailsMapper.toDomain<T>({
              ...market,
              offers_total,
              bags_total,
            });
          }),
        );
    }
  }

  async create(market: Market): Promise<void> {
    const data = PrismaMarketMapper.toPrisma(market);

    await prisma.$transaction(async (ctx) => {
      await ctx.market.create({ data });
    });
  }

  async update(market: Market): Promise<void> {
    const data = PrismaMarketMapper.toPrisma(market);

    await prisma.$transaction(async (ctx) => {
      await ctx.market.update({
        where: { id: market.id.value },
        data,
      });
    });
  }
}
