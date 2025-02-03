// Entities
import { Address } from "@/core/entities/address";

// Repositories
import {
  AddressesRepository,
  AddressesRepositorySearchRequest,
} from "@/core/repositories/addresses-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";

// Libraries
import { RepositoryResponse } from "@/core/types/repository-response";

export class PrismaAddressesRepository implements AddressesRepository {
  async find(
    _: RepositoryResponse,
    {
      id,
      complement,
      number,
      street,
      postal_code,
      neighborhood,
    }: AddressesRepositorySearchRequest
  ): Promise<Address | null> {
    const address = await prisma.address.findFirst({
      where: { id, complement, number, street, postal_code, neighborhood },
    });

    if (!address) return null;

    return PrismaAddressMapper.toDomain(address) as Address;
  }
}
