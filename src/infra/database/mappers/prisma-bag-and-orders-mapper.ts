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
import { BagRepositoryReturnType, BagEntityOf } from "@/core/repositories/bags-repository";

// Mappers
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";
import {
  PrismaOrderAndDetails,
  PrismaOrderAndDetailsMapper,
} from "@/infra/database/mappers/prisma-order-and-details-mapper";

export type PrismaBagAndOrders = PrismaBag & {
  customer: PrismaUser;
  address: PrismaAddress | null;
  payment: PrismaPayment | null;
  orders: PrismaOrderAndDetails[];
};

export class PrismaBagAndOrdersMapper {
  static toDomain<T extends BagRepositoryReturnType = "bag-and-orders">(
    raw: PrismaBagAndOrders,
  ): BagEntityOf<T> {
    return BagAndOrders.create({
      id: new UUID(raw.id),
      code: raw.code,
      status: raw.status,
      subtotal: raw.subtotal.toNumber(),
      shipping: raw.shipping.toNumber(),
      fee: raw.fee.toNumber(),
      comment: raw.comment,
      customer_id: raw.customer_id ? new UUID(raw.customer_id) : null,
      customer: PrismaUserMapper.toDomain(raw.customer),
      market_id: raw.market_id ? new UUID(raw.market_id) : null,
      cycle_id: raw.cycle_id ? new UUID(raw.cycle_id) : null,
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
      address: raw.address ? PrismaAddressMapper.toDomain(raw.address) : null,
      payment: raw.payment ? PrismaPaymentMapper.toDomain(raw.payment) : null,
      orders: raw.orders.map((order) =>
        PrismaOrderAndDetailsMapper.toDomain<"order-and-details">(order),
      ),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BagEntityOf<T>;
  }
}
