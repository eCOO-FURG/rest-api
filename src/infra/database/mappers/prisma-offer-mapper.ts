// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Offer } from "@/core/entities/offer";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaProductMapper } from "@/infra/database/mappers/prisma-product-mapper";

type PrismaOffer = Prisma.OfferGetPayload<{}> & {
  product?: Prisma.ProductGetPayload<{}>;
  catalog?: Prisma.CatalogGetPayload<{}>;
  orders?: Prisma.OrderGetPayload<{}>[];
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
      orders: new Map(
        raw.orders?.map((order) => [
          order.id,
          PrismaOrderMapper.toDomain(order),
        ])
      ),
      description: raw.description,
      expires_at: raw.expires_at,
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
      expires_at: offer.expires_at,
      updated_at: offer.updated_at,
      created_at: offer.created_at,
    };
  }
}
