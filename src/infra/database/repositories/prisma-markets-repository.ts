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
import { PrismaMarketAndOffersMapper } from "@/infra/database/mappers/prisma-market-and-offers-mapper";
import { PrismaMerchandise } from "@/infra/database/mappers/prisma-merchandise";

export class PrismaMarketsRepository implements MarketsRepository {
  async find<T extends MarketsRepositoryReturnType>(
    type: T,
    { id, name, open, offers }: MarketsRepositorySearchRequest,
  ): Promise<MarketEntityOf<T> | null> {
    const market = await prisma.market.findFirst({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        open,
      },
      include: {
        ...(type === "market-and-offers" && {
          offers: {
            include: {
              product: true,
              farm: { include: { admin: true } },
            },
          },
        }),
      },
    });

    if (!market) {
      return null;
    }

    switch (type) {
      default:
        return PrismaMarketMapper.toDomain<T>(market);
      case "market-and-offers":
        return PrismaMarketAndOffersMapper.toDomain<T>({
          ...market,
          offers: {
            data: market.offers as PrismaMerchandise[],
            total: await prisma.offer.count({ where: { market_id: market.id } }),
            size: 20,
            page: offers && offers.page ? offers.page : 1,
          },
        });
    }
  }

  async list<T extends MarketsRepositoryReturnType>(
    type: T,
    { id, name, open, offers }: MarketsRepositorySearchRequest,
    page?: number,
  ): Promise<MarketEntityOf<T>[]> {
    const markets = await prisma.market.findMany({
      where: {
        id,
        name: { contains: name, mode: "insensitive" },
        open,
      },
      include: {
        ...(type === "market-and-offers" && {
          offers: {
            include: {
              product: true,
              farm: { include: { admin: true } },
            },
          },
        }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
      orderBy: { created_at: "desc" },
    });

    switch (type) {
      default:
        return markets.map(PrismaMarketMapper.toDomain<T>);
      case "market-and-offers":
        return await Promise.all(
          markets.map(async (market) =>
            PrismaMarketAndOffersMapper.toDomain<T>({
              ...market,
              offers: {
                data: market.offers as PrismaMerchandise[],
                total: await prisma.offer.count({ where: { market_id: market.id } }),
                size: 20,
                page: offers && offers.page ? offers.page : 1,
              },
            }),
          ),
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
