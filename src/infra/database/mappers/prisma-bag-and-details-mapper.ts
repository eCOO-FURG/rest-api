// Entities
import { BagAndDetails } from "@/core/entities/aggregates/bag-and-details";

// Libraries
import {
  User as PrismaUser,
  Bag as PrismaBag,
  Address as PrismaAddress,
  Payment as PrismaPayment,
} from "@prisma/client";

// Repositories
import { BagEntityOf, BagRepositoryReturnType } from "@/core/repositories/bags-repository";
import { UUID } from "@/core/entities/aggregates/uuid";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";

export type PrismaBagAndDetails = PrismaBag & {
  customer: PrismaUser | null;
  address: PrismaAddress | null;
  payment: PrismaPayment | null;
};

export class PrismaBagAndDetailsMapper {
  static toDomain<T extends BagRepositoryReturnType = "bag-and-details">(
    raw: PrismaBagAndDetails,
  ): BagEntityOf<T> {
    return BagAndDetails.create({
      id: new UUID(raw.id),
      code: raw.code,
      status: raw.status,
      subtotal: raw.subtotal.toNumber(),
      fee: raw.fee.toNumber(),
      shipping: raw.shipping.toNumber(),
      comment: raw.comment,
      customer_id: raw.customer_id ? new UUID(raw.customer_id) : null,
      customer: raw.customer ? PrismaUserMapper.toDomain(raw.customer) : null,
      market_id: raw.market_id ? new UUID(raw.market_id) : null,
      cycle_id: raw.cycle_id ? new UUID(raw.cycle_id) : null,
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
      address: raw.address ? PrismaAddressMapper.toDomain(raw.address) : null,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      payment: raw.payment ? PrismaPaymentMapper.toDomain(raw.payment) : null,
    }) as BagEntityOf<T>;
  }
}
