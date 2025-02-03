// Entities
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";
import { PrismaOrderMapper } from "@/infra/database/mappers/prisma-order-mapper";
import { PrismaPaymentMapper } from "@/infra/database/mappers/prisma-payment-mapper";

type PrismaBag = Prisma.BagGetPayload<{}> & {
  customer?: Prisma.UserGetPayload<{}>;
  address?: Prisma.AddressGetPayload<{}> | null;
  orders?: Prisma.OrderGetPayload<{}>[];
  payments?: Prisma.PaymentGetPayload<{}>[];
};

export class PrismaBagMapper {
  static toDomain(raw: PrismaBag): Bag {
    return Bag.create({
      id: new UUID(raw.id),
      code: raw.code,
      status: raw.status,
      price: raw.price.toNumber(),
      cycle_id: new UUID(raw.cycle_id),
      user_id: new UUID(raw.user_id),
      ...(raw.customer && {
        user: PrismaUserMapper.toDomain(raw.customer),
      }),
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
      ...(raw.address && {
        address: PrismaAddressMapper.toDomain(raw.address),
      }),
      ...(raw.orders && {
        orders: new Map(
          raw.orders.map((order) => [
            order.id,
            PrismaOrderMapper.toDomain(order),
          ])
        ),
      }),
      ...(raw.payments && {
        payments: new Map(
          raw.payments.map((payment) => [
            payment.id,
            PrismaPaymentMapper.toDomain(payment),
          ])
        ),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      }),
    });
  }

  static toPrisma(bag: Bag): Prisma.BagUncheckedCreateInput {
    return {
      id: bag.id.value,
      user_id: bag.user_id.value,
      cycle_id: bag.cycle_id.value,
      address_id: bag.address_id ? bag.address_id.value : null,
      price: bag.price,
      code: bag.code,
      status: bag.status,
      created_at: bag.created_at,
      updated_at: bag.updated_at,
    };
  }
}
