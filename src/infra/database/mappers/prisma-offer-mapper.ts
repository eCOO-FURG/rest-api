// Entities
import { Offer } from "@/core/entities/offer";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";
import { PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";

type PrismaOffer = Prisma.OfferGetPayload<{}> & {
  product?: Prisma.ProductGetPayload<{}>;
  catalog?: Prisma.CatalogGetPayload<{}>;
};

export class PrismaOfferMapper {
  static toDomain(raw: PrismaOffer): Offer {
    return Offer.create({
      id: new UUID(raw.id),
      amount: raw.amount,
      price: raw.price.toNumber(),
      catalog_id: new UUID(raw.catalog_id),
      ...(raw.catalog && {
        catalog: PrismaCatalogMapper.toDomain(raw.catalog),
      }),
      product_id: new UUID(raw.product_id),
      ...(raw.product && {
        product: PrismaProductMapper.toDomain(raw.product),
      }),
      description: raw.description,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    return {
      id: offer.id.value,
      catalog_id: offer.catalog_id.value,
      product_id: offer.product_id.value,
      description: offer.description,
      amount: offer.amount,
      price: offer.price,
      updated_at: offer.updated_at,
      created_at: offer.created_at,
    };
  }
}
