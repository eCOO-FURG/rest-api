// Entities
import { Cycle } from "@/core/entities/cycle";

// Repositories
import {
  CyclesRepository,
  CyclesRepositorySearchRequest,
} from "@/core/repositories/cycles-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaCycleMapper } from "@/infra/database/mappers/prisma-cycle-mapper";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class PrismaCyclesRepository implements CyclesRepository {
  async find(
    _: RepositoryResponse,
    { id }: CyclesRepositorySearchRequest
  ): Promise<Cycle | null> {
    const cycle = await prisma.cycle.findFirst({ where: { id }, include: {} });

    if (!cycle) return null;

    return PrismaCycleMapper.toDomain(cycle);
  }
  async list(
    _: RepositoryResponse,
    { id }: CyclesRepositorySearchRequest,
    page?: number
  ): Promise<Cycle[]> {
    const cycles = await prisma.cycle.findMany({
      where: { id },
      include: {},
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return cycles.map(PrismaCycleMapper.toDomain);
  }
}
