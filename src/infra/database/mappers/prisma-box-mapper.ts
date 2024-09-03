// Entities
import { Box } from "@/core/entities/box";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma, Box as PrismaBox } from "@prisma/client";

export class PrismaBoxMapper {
  static toDomain(raw: PrismaBox) {
    return Box.create({
      ...raw,
      id: new UUID(raw.id),
      catalog_id: new UUID(raw.catalog_id),
    });
  }

  static toPrisma(box: Box): Prisma.BoxUncheckedCreateInput {
    return {
      ...box.props,
      id: box.id.value,
      catalog_id: box.id.value,
    };
  }
}
