// Entities
import { BagAggregate } from "@/core/entities/aggregates/bag-aggregate";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";

export class PrismaBagAggregateMapper {
  static toDomain(
    raw: Prisma.BagGetPayload<{ include: { customer: true; address: true } }>
  ) {
    return BagAggregate.create({
      ...raw,
      id: new UUID(raw.id),
      cycle_id: new UUID(raw.cycle_id),
      user: PrismaUserMapper.toDomain(raw.customer),
      address: raw.address ? PrismaAddressMapper.toDomain(raw.address) : null,
    });
  }
}
