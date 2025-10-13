// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Bag as PrismaBag } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Repositories
import { BagRepositoryReturnType, BagEntityOf } from "@/core/repositories/bags-repository";

export class PrismaBagMapper {
  static toDomain<T extends BagRepositoryReturnType = "bag">(raw: PrismaBag): BagEntityOf<T> {
    return Bag.create({
      id: new UUID(raw.id),
      code: raw.code,
      status: raw.status,
      fee: raw.fee.toNumber(),
      shipping: raw.shipping.toNumber(),
      subtotal: raw.subtotal.toNumber(),
      customer_id: new UUID(raw.customer_id),
      cycle_id: raw.cycle_id ? new UUID(raw.cycle_id) : null,
      market_id: raw.market_id ? new UUID(raw.market_id) : null,
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BagEntityOf<T>;
  }

  static toPrisma(bag: Bag): PrismaBag {
    return {
      id: bag.id.value,
      customer_id: bag.customer_id.value,
      market_id: bag.market_id ? bag.market_id.value : null,
      cycle_id: bag.cycle_id ? bag.cycle_id.value : null,
      address_id: bag.address_id ? bag.address_id.value : null,
      subtotal: new Decimal(bag.subtotal),
      fee: new Decimal(bag.fee),
      shipping: new Decimal(bag.shipping),
      code: bag.code,
      status: bag.status,
      created_at: bag.created_at,
      updated_at: bag.updated_at,
    };
  }
}
