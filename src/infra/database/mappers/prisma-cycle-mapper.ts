// Libraries
import { Prisma, Cycle as PrismaCycle } from "@prisma/client";

// Entities
import { Cycle, CycleWeek } from "@/core/entities/cycle";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import {
  CycleRepositoryReturnType,
  CycleEntityOf,
} from "@/core/repositories/cycles-repository";

export class PrismaCycleMapper {
  static toDomain<T extends CycleRepositoryReturnType = "cycle">(
    raw: PrismaCycle,
  ): CycleEntityOf<T> {
    const week = (days: number[]) => days.map((day) => day as CycleWeek[0]);

    return Cycle.create({
      id: new UUID(raw.id),
      alias: raw.alias,
      offer: week(raw.offer),
      order: week(raw.order),
      deliver: week(raw.deliver),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as CycleEntityOf<T>;
  }

  static toPrisma(cycle: Cycle): Prisma.CycleUncheckedCreateInput {
    return {
      id: cycle.id.value,
      alias: cycle.alias,
      offer: cycle.offer,
      order: cycle.order,
      deliver: cycle.deliver,
      created_at: cycle.created_at,
      updated_at: cycle.updated_at,
    };
  }
}
