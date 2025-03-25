// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";

// Libraries
import {
  Bag as PrismaBag,
  User as PrismaUser,
  Address as PrismaAddress,
  Payment as PrismaPayment,
} from "@prisma/client";

// Repositories
import {
  BagRepositoryReturnType,
  BagEntityOf,
} from "@/core/repositories/bags-repository";

// Mappers
import {
  PrismaOrderAndOffer,
  PrismaOrderAndOfferMapper,
} from "@/infra/database/mappers/prisma-order-and-offer-mapper";
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export type PrismaBagAndDetails = PrismaBag & {
  customer: PrismaUser;
  address: PrismaAddress | null;
  payment: PrismaPayment | null;
  orders: PrismaOrderAndOffer[];
};

export class PrismaBagAndOrdersMapper {
  static toDomain<T extends BagRepositoryReturnType>(
    raw: PrismaBagAndDetails
  ): BagEntityOf<T> {
    return BagAndOrders.create({
      id: new UUID(raw.id),
      code: raw.code,
      status: raw.status,
      verified: raw.verified,
      subtotal: raw.subtotal.toNumber(),
      shipping: raw.shipping.toNumber(),
      fee: raw.fee.toNumber(),
      customer_id: new UUID(raw.customer_id),
      customer: PrismaUserMapper.toDomain(raw.customer),
      cycle_id: new UUID(raw.cycle_id),
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
      address: raw.address ? PrismaAddressMapper.toDomain(raw.address) : null,
      payment: raw.payment ? PrismaPaymentMapper.toDomain(raw.payment) : null,
      orders: raw.orders.map((order) =>
        PrismaOrderAndOfferMapper.toDomain<"order-and-offer">(order)
      ),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BagEntityOf<T>;
  }
}
