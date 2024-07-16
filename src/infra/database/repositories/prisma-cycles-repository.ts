// Entities
import { Cycle } from "@/core/entities/cycle";

// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";
import { PrismaCycleMapper } from "@/infra/database/mappers/prisma-cycle-mapper";

export class PrismaCyclesRepository implements CyclesRepository {
  async findById(id: string): Promise<Cycle | null> {
    const cycle = await prisma.cycle.findUnique({
      where: {
        id,
      },
    });

    if (!cycle) return null;

    return PrismaCycleMapper.toDomain(cycle);
  }

  async findMany(): Promise<Cycle[]> {
    const data = await prisma.cycle.findMany({});

    const cycles = data.map((item) => PrismaCycleMapper.toDomain(item));

    return cycles;
  }
}
