// Libraries
import { Offer as PrismaOffer } from "@prisma/client";

// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OfferEntityOf,
  OfferRepositoryReturnType,
  OffersRepository,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import {
  PrismaMerchandise,
  PrismaMerchandiseMapper,
} from "@/infra/database/mappers/prisma-merchandise";
import {
  PrismaOfferAndProduct,
  PrismaOfferAndProductMapper,
} from "@/infra/database/mappers/prisma-offer-and-product-mapper";
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";

// Utils
import { now } from "@/core/utils/now";

export class PrismaOffersRepository implements OffersRepository {
  async find<T extends OfferRepositoryReturnType>(
    type: T,
    {
      id,
      ids,
      active,
      available,
      recurring,
      product,
      cycle,
      farm,
      market,
      since,
      before,
    }: OffersRepositorySearchRequest,
  ): Promise<OfferEntityOf<T> | null> {
    const offer = await prisma.offer.findFirst({
      where: {
        id,
        ...(ids && { id: { in: ids } }),
        cycle: { id: cycle?.id },
        market: {
          id: market?.id,
          ...(market?.name && { name: { contains: market.name, mode: "insensitive" } }),
        },
        farm: { id: farm?.id, name: { contains: farm?.name, mode: "insensitive" } },
        active,
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
          category: { id: product?.category?.id },
        },
        ...(available === "CYCLE" && {
          AND: [
            {
              opens_at: { not: { gt: now() } },
            },
            {
              OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
            },
            {
              OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
            },
            {
              active: true,
              amount: { gt: 0 },
            },
          ],
        }),
        ...(available === "MARKET" && {
          AND: [
            {
              opens_at: { not: { gt: now() } },
            },
            {
              OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
            },
            {
              active: true,
              amount: { gt: 0 },
            },
          ],
        }),
        ...(available === false && {
          OR: [
            { closes_at: { not: null, lte: now() } },
            { expires_at: { not: null, lte: now() } },
            { active: false },
            { amount: 0 },
          ],
        }),
        ...(typeof recurring === "boolean" && {
          closes_at: recurring ? null : { not: null },
        }),
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "offer-and-product" && { product: true }),
        ...(type === "merchandise" && {
          product: true,
          farm: { include: { admin: true } },
        }),
      },
    });

    if (!offer) {
      return null;
    }

    switch (type) {
      default:
        return PrismaOfferMapper.toDomain<T>(offer);
      case "offer-and-product":
        return PrismaOfferAndProductMapper.toDomain<T>(offer);
      case "merchandise":
        return PrismaMerchandiseMapper.toDomain<T>(offer as PrismaMerchandise);
    }
  }

  async list<T extends OfferRepositoryReturnType>(
    type: T,
    {
      id,
      ids,
      product,
      available,
      active,
      recurring,
      cycle,
      farm,
      market,
      since,
      before,
    }: OffersRepositorySearchRequest,
    page?: number,
  ): Promise<OfferEntityOf<T>[]> {
    const offers = await prisma.offer.findMany({
      where: {
        id,
        ...(ids && { id: { in: ids } }),
        cycle: { id: cycle?.id },
        market: {
          id: market?.id,
          ...(market?.name && { name: { contains: market.name, mode: "insensitive" } }),
        },
        farm: { id: farm?.id, name: farm?.name && { contains: farm.name, mode: "insensitive" } },
        active,
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
          category: { id: product?.category?.id },
        },
        ...(available === "CYCLE" && {
          AND: [
            {
              opens_at: { not: { gt: now() } },
            },
            {
              OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
            },
            {
              OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
            },
            {
              active: true,
              amount: { gt: 0 },
            },
          ],
        }),
        ...(available === "MARKET" && {
          AND: [
            {
              opens_at: { not: { gt: now() } },
            },
            {
              OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
            },
            {
              active: true,
              amount: { gt: 0 },
            },
          ],
        }),
        ...(available === false && {
          OR: [
            { closes_at: { not: null, lte: now() } },
            { expires_at: { not: null, lte: now() } },
            { active: false },
            { amount: 0 },
          ],
        }),
        ...(typeof recurring === "boolean" && {
          closes_at: recurring ? null : { not: null },
        }),
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "offer-and-product" && { product: true }),
        ...(type === "merchandise" && {
          product: true,
          farm: { include: { admin: true } },
        }),
      },
      orderBy: { created_at: "desc" },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return offers.map(PrismaOfferMapper.toDomain<T>);
      case "offer-and-product":
        return offers.map((offer) =>
          PrismaOfferAndProductMapper.toDomain<T>(offer as PrismaOfferAndProduct),
        );
      case "merchandise":
        return offers.map((offer) =>
          PrismaMerchandiseMapper.toDomain<T>(offer as PrismaMerchandise),
        );
    }
  }

  async create(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    await prisma.offer.create({ data });
  }

  async update(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    await prisma.offer.update({
      where: { id: offer.id.value },
      data,
    });
  }

  async delete(offer: Offer): Promise<void> {
    await prisma.offer.delete({
      where: { id: offer.id.value },
    });
  }

  async publishCycleOnMarket(cycle_id: string, market_id: string): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      const latestOneTimeOffer = await ctx.offer.findFirst({
        where: {
          cycle_id,
          closes_at: { not: null },
        },
        orderBy: { created_at: "desc" },
      });

      if (!latestOneTimeOffer) {
        return await ctx.offer.updateMany({
          where: {
            cycle_id,
            AND: [
              {
                OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
              },
              {
                active: true,
                amount: { gt: 0 },
              },
            ],
          },
          data: { market_id },
        });
      }

      const { opens_at, closes_at } = latestOneTimeOffer as PrismaOffer & { closes_at: Date };

      await ctx.offer.updateMany({
        where: {
          cycle_id,
          AND: [
            {
              OR: [
                { closes_at: null },
                {
                  opens_at: { gte: opens_at },
                  closes_at: { lte: closes_at },
                },
              ],
            },
            {
              OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
            },
            {
              active: true,
              amount: { gt: 0 },
            },
          ],
        },
        data: { market_id },
      });
    });
  }
}
