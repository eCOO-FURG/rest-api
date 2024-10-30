// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export class PrismaFarmAggregateMapper {
  static toDomain(raw: Prisma.FarmGetPayload<{ include: { admin: true } }>) {
    return FarmAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      admin: PrismaUserMapper.toDomain(raw.admin),
    });
  }
}
