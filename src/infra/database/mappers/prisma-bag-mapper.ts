// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/value-objects/uuid";

// Libs
import { Prisma, Bag as PrismaBag } from "@prisma/client";

export class PrismaBagMapper {
  static toDomain(raw: PrismaBag) {
    return Bag.create({
      ...raw,
      id: new UUID(raw.id),
      user_id: new UUID(raw.user_id),
      cycle_id: new UUID(raw.cycle_id),
    });
  }

  static toPrisma(bag: Bag): Prisma.BagUncheckedCreateInput {
    return {
      ...bag.props,
      id: bag.id.value,
      user_id: bag.user_id.value,
      cycle_id: bag.cycle_id.value,
    };
  }
}
