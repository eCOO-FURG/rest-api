// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { Prisma, Bag as PrismaBag } from "@prisma/client";

export class PrismaBagMapper {
  static toDomain(raw: PrismaBag) {
    return Bag.create({
      ...raw,
      id: new UUID(raw.id),
      user_id: new UUID(raw.user_id),
      cycle_id: new UUID(raw.cycle_id),
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
    });
  }

  static toPrisma(bag: Bag): Prisma.BagUncheckedCreateInput {
    return {
      ...bag.props,
      id: bag.id.value,
      user_id: bag.user_id.value,
      cycle_id: bag.cycle_id.value,
      address_id: bag.address_id ? bag.address_id.value : null,
    };
  }
}
