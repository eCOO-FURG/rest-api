// Entities
import { FarmAggregate } from "@/core/entities/value-objects/farm-aggregate";

// Libs
import { Prisma } from "@prisma/client";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export class PrismaFarmAggregateMapper {
  static toDomain(raw: Prisma.FarmGetPayload<{ include: { admin: true } }>) {
    return FarmAggregate.create({
      name: raw.name,
      caf: raw.caf,
      active: raw.active,
      tax: raw.tax,
      admin: PrismaUserMapper.toDomain(raw.admin),
    });
  }
}
