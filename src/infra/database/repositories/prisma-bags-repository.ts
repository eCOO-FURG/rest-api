// Entities
import { Bag } from "@/core/entities/bag";

// Repositories
import {
  BagsRepository,
  BagsRepositoryResponse,
  BagsRepositorySearchManyRequest,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Mappers
import { PrismaBagMapper } from "@/infra/database/mappers/prisma-bag-mapper";
import { PrismaBagAggreagateMapper } from "@/infra/database/mappers/prisma-bag-aggregate-mapper";

// Libs
import { prisma } from "@/infra/database/prisma-service";

export class PrismaBagsRepository implements BagsRepository {
  async findById<T extends RepositoryResponse = "entity">(
    id: string,
    type = "entity"
  ): Promise<BagsRepositoryResponse<T> | null> {
    if (type === "entity") {
      const found = await prisma.bag.findFirst({ where: { id } });

      if (!found) return null;

      return PrismaBagMapper.toDomain(found) as BagsRepositoryResponse<T>;
    }

    const found = await prisma.bag.findFirst({
      where: { id },
      include: { customer: true },
    });

    if (!found) return null;

    return PrismaBagAggreagateMapper.toDomain(
      found
    ) as BagsRepositoryResponse<T>;
  }

  async search<T extends RepositoryResponse = "entity">(
    { user_id, cycle_id, since }: BagsRepositorySearchRequest,
    type = "entity"
  ): Promise<BagsRepositoryResponse<T> | null> {
    const where = {
      user_id,
      cycle_id,
    };

    if (since) Object.assign(where, { created_at: { gte: since } });

    if (type === "entity") {
      const found = await prisma.bag.findFirst({ where });

      if (!found) return null;

      return PrismaBagMapper.toDomain(found) as BagsRepositoryResponse<T>;
    }

    const found = await prisma.bag.findFirst({
      where,
      include: { customer: true },
    });

    if (!found) return null;

    return PrismaBagAggreagateMapper.toDomain(
      found
    ) as BagsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse = "entity">(
    { page, cycle_id, name, since, status }: BagsRepositorySearchManyRequest,
    type = "entity"
  ): Promise<BagsRepositoryResponse<T>[]> {
    const skip = (page - 1) * 20;

    const where = {
      cycle_id,
      status,
      customer: {
        OR: [
          {
            first_name: {
              contains: name ?? "",
            },
          },
          {
            last_name: {
              contains: name ?? "",
            },
          },
        ],
      },
    };

    if (since) Object.assign(where, { created_at: { gte: since } });

    if (type === "entity") {
      const found = await prisma.bag.findMany({
        where,
        skip,
        take: 20,
      });

      return found.map((bag) =>
        PrismaBagMapper.toDomain(bag)
      ) as BagsRepositoryResponse<T>[];
    }

    const found = await prisma.bag.findMany({
      where,
      include: {
        customer: true,
      },
      skip,
      take: 20,
    });

    return found.map((bag) =>
      PrismaBagAggreagateMapper.toDomain(bag)
    ) as BagsRepositoryResponse<T>[];
  }

  async create(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);
    await prisma.bag.create({ data });
  }
}
