// Entities
import { CategoryAndOffers } from "@/core/entities/aggregates/category-and-offers";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Category as PrismaCategory, Product as PrismaProduct } from "@prisma/client";

// Mappers
import {
  PrismaOfferAndDetails,
  PrismaOfferAndDetailsMapper,
} from "@/infra/database/mappers/prisma-offer-and-details-mapper";

// Repositories
import {
  CategoryEntityOf,
  CategoryRepositoryReturnType,
} from "@/core/repositories/categories-repository";

export type PrismaCategoryAndOffers = PrismaCategory & {
  products: (PrismaProduct & {
    offers: PrismaOfferAndDetails[];
  })[];
};

export class PrismaCategoryAndOffersMapper {
  static toDomain<T extends CategoryRepositoryReturnType = "category-and-offers">(
    raw: PrismaCategoryAndOffers,
  ): CategoryEntityOf<T> {
    return CategoryAndOffers.create({
      id: new UUID(raw.id),
      name: raw.name,
      image: raw.image,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      offers: raw.products.flatMap((product) =>
        product.offers.map((offer) =>
          PrismaOfferAndDetailsMapper.toDomain({
            ...offer,
            product: { ...product },
          }),
        ),
      ),
    }) as CategoryEntityOf<T>;
  }
}
