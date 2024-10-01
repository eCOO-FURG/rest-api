// Entities
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libs
import { Prisma } from "@prisma/client";

export class PrismaAddressMapper {
  static toDomain(raw: Prisma.AddressGetPayload<{}>) {
    return Address.create({
      ...raw,
      id: new UUID(raw.id),
    });
  }
  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      ...address.props,
      id: address.id.value,
    };
  }
}
