// Libraries
import { Farm as PrismaFarm, User as PrismaUser } from "@prisma/client";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";
import {
  PrismaOfferAndProduct,
  PrismaOfferAndProductMapper,
} from "@/infra/database/mappers/prisma-offer-and-product-mapper";

// Repositories
import { FarmEntityOf, FarmRepositoryReturnType } from "@/core/repositories/farms-repository";

export type PrismaCatalog = PrismaFarm & {
  admin: PrismaUser;
  offers: PrismaOfferAndProduct[];
};

export class PrismaCatalogMapper {
  static toDomain<T extends FarmRepositoryReturnType = "farm-and-admin">(
    raw: PrismaCatalog,
  ): FarmEntityOf<T> {
    return FarmAndAdmin.create({
      id: new UUID(raw.id),
      status: raw.status,
      name: raw.name,
      fee: raw.fee,
      tally: raw.tally,
      description: raw.description,
      images: raw.images,
      photo: raw.photo,
      offers: raw.offers.map(PrismaOfferAndProductMapper.toDomain),
      admin_id: new UUID(raw.admin_id),
      admin: PrismaUserMapper.toDomain(raw.admin),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as FarmEntityOf<T>;
  }
}
