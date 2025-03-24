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
import { PrismaOfferAndProductMapper } from "@/infra/database/mappers/prisma-offer-and-product-mapper";
export class PrismaOffersRepository implements OffersRepository {
  async find<T extends OfferRepositoryReturnType>(
    type: T,
    { id, product, catalog, since, before }: OffersRepositorySearchRequest
  ): Promise<OfferEntityOf<T> | null> {
    const offer = await prisma.offer.findUnique({
      where: {
        id,
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
        },
        catalog: { id: catalog?.id },
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "offer-and-product" && { product: true }),
      },
    });

    if (!offer) return null;

    switch (type) {
      default:
        return PrismaOfferMapper.toDomain<T>(offer);
      case "offer-and-product":
        return PrismaOfferAndProductMapper.toDomain<T>(offer);
    }
  }

  async list<T extends OfferRepositoryReturnType>(
    type: T,
    { id, ids, product, catalog, since, before }: OffersRepositorySearchRequest,
    page?: number
  ): Promise<OfferEntityOf<T>[]> {
    const offers = await prisma.offer.findMany({
      where: {
        id: { in: ids, equals: id },
        product: {
          id: product?.id,
          name: { contains: product?.name, mode: "insensitive" },
        },
        catalog: { id: catalog?.id },
        created_at: { gte: since, lte: before },
      },
      include: {
        ...(type === "offer-and-product" && { product: true }),
      },
      orderBy: { created_at: "desc" },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    switch (type) {
      default:
        return offers.map(PrismaOfferMapper.toDomain<T>);
      case "offer-and-product":
        return offers.map(PrismaOfferAndProductMapper.toDomain<T>);
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
