import { BagAndCustomer } from "@/core/entities/aggregates/bag-and-customer";
import {
  User as PrismaUser,
  Bag as PrismaBag,
  Address as PrismaAddress,
} from "@prisma/client";

// Repositories
import {
  BagEntityOf,
  BagRepositoryReturnType,
} from "@/core/repositories/bags-repository";
import { UUID } from "@/core/entities/aggregates/uuid";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";

export type PrismaBagAndCustomer = PrismaBag & {
  customer: PrismaUser;
  address: PrismaAddress | null;
};

export class PrismaBagAndCustomerMapper {
  static toDomain<T extends BagRepositoryReturnType>(
    raw: PrismaBagAndCustomer
  ): BagEntityOf<T> {
    return BagAndCustomer.create({
      id: new UUID(raw.id),
      code: raw.code,
      status: raw.status,
      verified: raw.verified,
      paid: raw.paid,
      subtotal: raw.subtotal.toNumber(),
      fee: raw.fee.toNumber(),
      shipping: raw.shipping.toNumber(),
      customer_id: new UUID(raw.customer_id),
      customer: PrismaUserMapper.toDomain(raw.customer),
      cycle_id: new UUID(raw.cycle_id),
      address_id: raw.address_id ? new UUID(raw.address_id) : null,
      address: raw.address ? PrismaAddressMapper.toDomain(raw.address) : null,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as BagEntityOf<T>;
  }
}
