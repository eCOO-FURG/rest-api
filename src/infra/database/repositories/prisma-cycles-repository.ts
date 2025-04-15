// Repositories
import {
  CyclesRepository,
  CyclesRepositorySearchRequest,
  CycleRepositoryReturnType,
  CycleEntityOf,
} from "@/core/repositories/cycles-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaCycleMapper } from "@/infra/database/mappers/prisma-cycle-mapper";

export class PrismaCyclesRepository implements CyclesRepository {
  async find<T extends CycleRepositoryReturnType>(_: T, { id }: CyclesRepositorySearchRequest): Promise<CycleEntityOf<T> | null> {
    const cycle = await prisma.cycle.findFirst({ where: { id } });

    if (!cycle) return null;

    return PrismaCycleMapper.toDomain(cycle) as CycleEntityOf<T>;
  }
  async list<T extends CycleRepositoryReturnType>(_: T, { id }: CyclesRepositorySearchRequest, page?: number): Promise<CycleEntityOf<T>[]> {
    const cycles = await prisma.cycle.findMany({
      where: { id },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return cycles.map(PrismaCycleMapper.toDomain) as CycleEntityOf<T>[];
  }
}
