// Entities
import { Bag } from "@/core/entities/bag";

// Repositories
import {
  BagsRepository,
  BagsRepositoryResponse,
  BagsRepositorySearchRequest,
} from "@/core/repositories/bags-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Mappers
import { PrismaBagAggreagateMapper } from "../mappers/prisma-bag-aggregate-mapper";

// Libs
import { prisma } from "@/infra/database/prisma-service";
import { PrismaBagMapper } from "../mappers/prisma-bag-mapper";

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

  async create(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);

    await prisma.bag.create({ data });
  }

  async update(bag: Bag): Promise<void> {
    const data = PrismaBagMapper.toPrisma(bag);

    await prisma.bag.update({ where: { id: bag.id.value }, data });
  }
}
