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
  PrismaOfferAndDetails,
  PrismaOfferAndDetailsMapper,
} from "@/infra/database/mappers/prisma-offer-and-details-mapper";
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
        market: { id: market?.id, name: { contains: market?.name, mode: "insensitive" } },
        farm: { id: farm?.id, name: { contains: farm?.name, mode: "insensitive" } },
        active,
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
          category: { id: product?.category?.id },
        },
        ...(typeof available === "boolean" &&
          (available
            ? {
                AND: [
                  {
                    OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
                  },
                  {
                    OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                  },
                  {
                    active: true,
                    amount: { not: 0 },
                  },
                ],
              }
            : {
                OR: [
                  { closes_at: { not: null, lte: now() } },
                  { expires_at: { not: null, lte: now() } },
                  { active: false },
                  { amount: 0 },
                ],
              })),
        ...(typeof recurring === "boolean" && {
          closes_at: recurring ? null : { not: null },
        }),
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "offer-and-product" && { product: true }),
        ...(type === "offer-and-details" && {
          product: true,
          farm: { include: { admin: true } },
        }),
      },
    });

    if (!offer) return null;

    switch (type) {
      default:
        return PrismaOfferMapper.toDomain<T>(offer);
      case "offer-and-product":
        return PrismaOfferAndProductMapper.toDomain<T>(offer);
      case "offer-and-details":
        return PrismaOfferAndDetailsMapper.toDomain<T>(offer as PrismaOfferAndDetails);
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
          name: market?.name && { contains: market.name, mode: "insensitive" },
        },
        farm: { id: farm?.id, name: farm?.name && { contains: farm.name, mode: "insensitive" } },
        active,
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
          category: { id: product?.category?.id },
        },
        ...(typeof available === "boolean" &&
          (available
            ? {
                AND: [
                  {
                    OR: [{ closes_at: null }, { closes_at: { gt: now() } }],
                  },
                  {
                    OR: [{ expires_at: null }, { expires_at: { gte: now() } }],
                  },
                  {
                    active: true,
                    amount: { not: 0 },
                  },
                ],
              }
            : {
                OR: [
                  { closes_at: { not: null, lte: now() } },
                  { expires_at: { not: null, lte: now() } },
                  { active: false },
                  { amount: 0 },
                ],
              })),
        ...(typeof recurring === "boolean" && {
          closes_at: recurring ? null : { not: null },
        }),
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "offer-and-product" && { product: true }),
        ...(type === "offer-and-details" && {
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
      case "offer-and-details":
        return offers.map((offer) =>
          PrismaOfferAndDetailsMapper.toDomain<T>(offer as PrismaOfferAndDetails),
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
}
