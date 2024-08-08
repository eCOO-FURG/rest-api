// Entities
import { BagAggregate } from "@/core/entities/value-objects/bag-aggregate";
import { UUID } from "@/core/entities/value-objects/uuid";

// Libs
import { Prisma } from "@prisma/client";
import { PrismaUserMapper } from "./prisma-user-mapper";

export class PrismaBagAggreagateMapper {
  static toDomain(raw: Prisma.BagGetPayload<{ include: { customer: true } }>) {
    return BagAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      cycle_id: new UUID(raw.cycle_id),
      user: PrismaUserMapper.toDomain(raw.customer),
    });
  }
}
