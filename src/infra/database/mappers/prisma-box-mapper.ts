// Entities
import { Box } from "@/core/entities/box";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma, Box as PrismaBox } from "@prisma/client";

// Repositories
import { BoxRepositoryReturnType } from "@/core/repositories/boxes-repository";
import { BoxEntityOf } from "@/core/repositories/boxes-repository";

export class PrismaBoxMapper {
  static toDomain<T extends BoxRepositoryReturnType = "box">(
    raw: PrismaBox,
  ): BoxEntityOf<T> {
    return Box.create({
      id: new UUID(raw.id),
      status: raw.status,
      catalog_id: new UUID(raw.catalog_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BoxEntityOf<T>;
  }

  static toPrisma(box: Box): Prisma.BoxUncheckedCreateInput {
    return {
      id: box.id.value,
      catalog_id: box.catalog_id.value,
      status: box.status,
      created_at: box.created_at,
      updated_at: box.updated_at,
    };
  }
}
