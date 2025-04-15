// Repositories
import {
  AddressesRepository,
  AddressesRepositorySearchRequest,
  AddressRepositoryReturnType,
  AddressEntityOf,
} from "@/core/repositories/addresses-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";

export class PrismaAddressesRepository implements AddressesRepository {
  async find<T extends AddressRepositoryReturnType>(
    _: T,
    { id, complement, number, street, postal_code, neighborhood }: AddressesRepositorySearchRequest,
  ): Promise<AddressEntityOf<T> | null> {
    const address = await prisma.address.findFirst({
      where: { id, complement, number, street, postal_code, neighborhood },
    });

    if (!address) return null;

    return PrismaAddressMapper.toDomain<T>(address);
  }
}
