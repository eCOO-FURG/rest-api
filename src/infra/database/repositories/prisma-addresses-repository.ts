// Entities
import { Address } from "@/core/entities/address";

// Repositories
import {
  AddressesRepository,
  AddressesRepositoryResponse,
  AddressesRepositorySearchRequest,
} from "@/core/repositories/addresses-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaAddressMapper } from "@/infra/database/mappers/prisma-address-mapper";

// Libs
import { Prisma } from "@prisma/client";

export class PrismaAddressesRepository implements AddressesRepository {
  async search({
    id,
    complement,
    number,
    street,
    postal_code,
  }: AddressesRepositorySearchRequest): Promise<AddressesRepositoryResponse | null> {
    const where: Prisma.AddressWhereInput = {
      id,
      complement,
      number,
      street,
      postal_code,
    };

    const found = await prisma.address.findFirst({ where });

    if (!found) return null;

    return PrismaAddressMapper.toDomain(found) as AddressesRepositoryResponse;
  }

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address);

    await prisma.address.create({ data });
  }
}
