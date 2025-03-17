// Entities
import { Box } from "@/core/entities/box";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaCatalogMapper } from "@/infra/database/mappers/prisma-catalog-mapper";

type PrismaBox = Prisma.BoxGetPayload<{}> & {
  orders?: Prisma.OrderGetPayload<{}>[];
  catalog?: Prisma.CatalogGetPayload<{}>;
};

export class PrismaBoxMapper {
  static toDomain(raw: PrismaBox): Box {
    return Box.create({
      id: new UUID(raw.id),
      status: raw.status,
      verified: raw.verified,
      catalog_id: new UUID(raw.catalog_id),
      ...(raw.catalog && {
        catalog: PrismaCatalogMapper.toDomain(raw.catalog),
      }),
      ...(raw.orders && {
        orders: raw.orders.map((order) => PrismaOrderMapper.toDomain(order)),
      }),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(box: Box): Prisma.BoxUncheckedCreateInput {
    return {
      id: box.id.value,
      catalog_id: box.catalog_id.value,
      status: box.status,
      verified: box.verified,
      created_at: box.created_at,
      updated_at: box.updated_at,
    };
  }
}
