// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OffersRepository,
  OffersRepositorySearchRequest,
  OfferEntityOf,
  OfferRepositoryReturnType,
} from "@/core/repositories/offers-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";
import { PrismaOfferAndProduct, PrismaOfferAndProductMapper } from "@/infra/database/mappers/prisma-offer-and-product-mapper";
import { PrismaOfferAndDetails, PrismaOfferAndDetailsMapper } from "@/infra/database/mappers/prisma-offer-and-details-mapper";

export class PrismaOffersRepository implements OffersRepository {
  async find<T extends OfferRepositoryReturnType>(
    type: T,
    { id, product, catalog, active, recurring, since, before }: OffersRepositorySearchRequest,
  ): Promise<OfferEntityOf<T> | null> {
    const offer = await prisma.offer.findFirst({
      where: {
        id,
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
        },
        catalog: { id: catalog?.id },
        recurring,
        active,
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "offer-and-product" && { product: true }),
        ...(type === "offer-and-details" && {
          product: true,
          catalog: { include: { farm: { include: { admin: true } } } },
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
    { id, ids, product, catalog, active, recurring, since, before }: OffersRepositorySearchRequest,
    page?: number,
  ): Promise<OfferEntityOf<T>[]> {
    const offers = await prisma.offer.findMany({
      where: {
        id: { in: ids, equals: id },
        active,
        recurring,
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
        },
        catalog: { id: catalog?.id },
        created_at: { gte: since, lte: before },
      },
      include:
        type === "offer-and-product"
          ? { product: true }
          : type === "offer-and-details"
            ? {
                product: true,
                catalog: { include: { farm: { include: { admin: true } } } },
              }
            : null,
      orderBy: { created_at: "desc" },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return offers.map(PrismaOfferMapper.toDomain<T>);
      case "offer-and-product":
        return offers.map((offer) => PrismaOfferAndProductMapper.toDomain<T>(offer as PrismaOfferAndProduct));
      case "offer-and-details":
        return offers.map((offer) => PrismaOfferAndDetailsMapper.toDomain<T>(offer as PrismaOfferAndDetails));
    }
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
