// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OffersRepository,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOfferMapper } from "@/infra/database/mappers/prisma-offer-mapper";

export class PrismaOffersRepository implements OffersRepository {
  async list(
    type: RepositoryResponse,
    { id, ids, product, catalog, since, before }: OffersRepositorySearchRequest,
    page?: number
  ): Promise<Offer[]> {
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
        product: true,
        catalog: { include: { farm: true } },
      },
      orderBy: { created_at: "desc" },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return offers.map(PrismaOfferMapper.toDomain);
  }
}
