// Entities
import { Offer } from "@/core/entities/offer";
import { OfferWithProductAndCycle } from "@/core/entities/value-objects/offer-with-product-and-cycle";

// Repositories
import {
  OffersRepository,
  OffersRepositorySearchManyRequest,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";
import { PrismaOfferMapper } from "../mappers/prisma-offer-mapper";
import { PrismaOfferWithProductAndCycleMapper } from "../mappers/prisma-offer-with-product-and-cycle-mapper";

export class PrismaOffersRepository implements OffersRepository {
  async findById(id: string): Promise<Offer | null> {
    const offer = await prisma.offer.findUnique({ where: { id } });

    if (!offer) return null;

    return PrismaOfferMapper.toDomain(offer);
  }

  async findByIdWithProductAndCycle(
    id: string
  ): Promise<OfferWithProductAndCycle | null> {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { product: true, cycle: true },
    });

    if (!offer) return null;

    return PrismaOfferWithProductAndCycleMapper.toDomain(offer);
  }

  async searchMany({
    farm_id,
    cycle_id,
    created_at,
    product,
    page,
  }: OffersRepositorySearchManyRequest): Promise<Offer[]> {
    const offers = await prisma.offer.findMany({
      where: {
        farm_id,
        cycle_id,
        created_at: {
          gte: created_at,
        },
        product: {
          name: {
            contains: product ?? "",
          },
        },
      },
      skip: page ? (page - 1) * 20 : 0,
      take: page && 20,
    });

    return offers.map((offer) => PrismaOfferMapper.toDomain(offer));
  }

  async search({
    cycle_id,
    farm_id,
    product_id,
    created_at,
  }: OffersRepositorySearchRequest): Promise<Offer | null> {
    const offer = await prisma.offer.findFirst({
      where: {
        farm_id,
        product_id,
        cycle_id,
        created_at: {
          gte: created_at,
        },
      },
    });

    if (!offer) return null;

    return PrismaOfferMapper.toDomain(offer);
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
