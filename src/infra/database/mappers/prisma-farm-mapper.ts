// Libs
import { Farm as PrismaFarm, Prisma } from "@prisma/client";

// Entities
import { Farm } from "@/core/entities/farm";
import { UUID } from "@/core/entities/value-objects/uuid";

export class PrismaFarmMapper {
  static toDomain(raw: PrismaFarm) {
    return Farm.create({
      ...raw,
      admin_id: new UUID(raw.admin_id),
      id: new UUID(raw.id),
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
