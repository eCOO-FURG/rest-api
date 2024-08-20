import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Prisma } from "@prisma/client";
import { PrismaUserMapper } from "./prisma-user-mapper";

export class PrismaFarmAggregateMapper {
  static toDomain(raw: Prisma.FarmGetPayload<{ include: { admin: true } }>) {
    return FarmAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      admin: PrismaUserMapper.toDomain(raw.admin),
    });
  }
}
