// Entities
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";
import { AddressEntityOf, AddressRepositoryReturnType } from "@/core/repositories/addresses-repository";

// Libraries
import { Prisma } from "@prisma/client";

type PrismaAddress = Prisma.AddressGetPayload<{}>;

export class PrismaAddressMapper {
  static toDomain<T extends AddressRepositoryReturnType = "address">(raw: PrismaAddress): AddressEntityOf<T> {
    return Address.create({
      id: new UUID(raw.id),
      number: raw.number,
      street: raw.street,
      neighborhood: raw.neighborhood,
      postal_code: raw.postal_code,
      complement: raw.complement,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as AddressEntityOf<T>;
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.value,
      number: address.number,
      street: address.street,
      neighborhood: address.neighborhood,
      postal_code: address.postal_code,
      complement: address.complement,
      created_at: address.created_at,
      updated_at: address.updated_at,
    };
  }
}
