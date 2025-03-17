// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Catalog } from "@/core/entities/catalog";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaFarmMapper } from "@/infra/database/mappers/prisma-farm-mapper";
import {
  PrismaOffer,
  PrismaOfferMapper,
} from "@/infra/database/mappers/prisma-offer-mapper";

type PrismaCatalog = Prisma.CatalogGetPayload<{}> & {
  farm?: Prisma.FarmGetPayload<{}>;
  offers?: PrismaOffer[];
};

export class PrismaCatalogMapper {
  static toDomain(raw: PrismaCatalog): Catalog {
    return Catalog.create({
      id: new UUID(raw.id),
      fee: raw.fee,
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
      ...(raw.farm && {
        farm: PrismaFarmMapper.toDomain(raw.farm),
      }),
      offers: raw.offers?.map((offer) => PrismaOfferMapper.toDomain(offer)),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(catalog: Catalog): Prisma.CatalogUncheckedCreateInput {
    return {
      id: catalog.id.value,
      fee: catalog.fee,
      cycle_id: catalog.cycle_id.value,
      farm_id: catalog.farm_id.value,
      created_at: catalog.created_at,
      updated_at: catalog.updated_at,
    };
  }
}
