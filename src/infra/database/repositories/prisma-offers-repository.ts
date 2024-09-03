// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OffersRepository,
  OffersRepositoryResponse,
  OffersRepositorySearchManyRequest,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";
import { PrismaOfferAggregateMapper } from "@/infra/database/mappers/prisma-offer-aggregate-mapper";

// Libs
import { Prisma } from "@prisma/client";

export class PrismaOffersRepository implements OffersRepository {
  async search<T extends RepositoryResponse>(
    { id, product, catalog, since }: OffersRepositorySearchRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T> | null> {
    const where: Prisma.OfferWhereInput = {
      id,
      catalog,
      product,
      ...(since && { created_at: { gte: since } }),
    };

    if (type === "aggregate") {
      const offer = await prisma.offer.findFirst({ where });

      if (!offer) return null;

      return PrismaOfferMapper.toDomain(offer) as OffersRepositoryResponse<T>;
    }

    const offer = await prisma.offer.findFirst({
      where,
      include: { product: true },
    });

    if (!offer) return null;

    return PrismaOfferAggregateMapper.toDomain(
      offer
    ) as OffersRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { ids, catalog, since, product, page }: OffersRepositorySearchManyRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T>[]> {
    const where: Prisma.OfferWhereInput = {
      catalog,
      ...(ids && { id: { in: ids } }),
      ...(since && { created_at: { gte: since } }),
      ...(product && { product: { name: { contains: product.name } } }),
    };

    const query: Prisma.OfferFindManyArgs = {
      where,
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    };

    if (type === "entity") {
      const offers = await prisma.offer.findMany(query);

      return offers.map((offer) =>
        PrismaOfferMapper.toDomain(offer)
      ) as OffersRepositoryResponse<T>[];
    }

    const offers = await prisma.offer.findMany({
      ...query,
      include: { product: true },
    });

    return offers.map((offer) =>
      PrismaOfferAggregateMapper.toDomain(offer)
    ) as OffersRepositoryResponse<T>[];
  }

  async create(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);
    await prisma.offer.create({ data });
  }

  async update(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);
    await prisma.offer.update({ where: { id: offer.id.value }, data });
  }

  async delete(offer: Offer): Promise<void> {
    await prisma.offer.delete({ where: { id: offer.id.value } });
  }
}
