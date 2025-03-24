// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Bag as PrismaBag } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
  BagRepositoryReturnType,
  BagEntityOf,
} from "@/core/repositories/bags-repository";

export class PrismaBagMapper {
  static toDomain<T extends BagRepositoryReturnType>(
    raw: PrismaBag
  ): BagEntityOf<T> {
    return Bag.create({
      id: new UUID(raw.id),
      code: raw.code,
      status: raw.status,
      verified: raw.verified,
      paid: raw.paid,
      subtotal: raw.subtotal.toNumber(),
      fee: raw.fee.toNumber(),
      shipping: raw.shipping.toNumber(),
      customer_id: new UUID(raw.customer_id),
      cycle_id: new UUID(raw.cycle_id),
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BagEntityOf<T>;
  }

  static toPrisma(bag: Bag): PrismaBag {
    return {
      id: bag.id.value,
      customer_id: bag.customer_id.value,
      cycle_id: bag.cycle_id.value,
      address_id: bag.address_id ? bag.address_id.value : null,
      subtotal: new Decimal(bag.subtotal),
      fee: new Decimal(bag.fee),
      shipping: new Decimal(bag.shipping),
      paid: bag.paid,
      verified: bag.verified,
      code: bag.code,
      status: bag.status,
      created_at: bag.created_at,
      updated_at: bag.updated_at,
    };
  }
}
