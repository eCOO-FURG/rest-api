// Libs
import { Farm as PrismaFarm, Prisma } from "@prisma/client";
import { UUID } from "@/core/entities/aggregates/uuid";

// Entities
import { Farm } from "@/core/entities/farm";

export class PrismaFarmMapper {
  static toDomain(raw: PrismaFarm) {
    return Farm.create({
      ...raw,
      id: new UUID(raw.id),
      admin_id: new UUID(raw.admin_id),
    });
  }

  static toPrisma(farm: Farm): Prisma.FarmUncheckedCreateInput {
    return {
      ...farm.props,
      id: farm.id.value,
      admin_id: farm.admin_id.value,
    };
  }
}
