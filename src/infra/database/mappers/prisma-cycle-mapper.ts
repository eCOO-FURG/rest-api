// Libraries
import { Prisma } from "@prisma/client";

// Entities
import { Cycle, Week } from "@/core/entities/cycle";
import { UUID } from "@/core/entities/aggregates/uuid";

export type PrismaCycle = Prisma.CycleGetPayload<{}>;

export class PrismaCycleMapper {
  static toDomain(raw: PrismaCycle): Cycle {
    const week = (days: number[]) => days.map((day) => day as Week[0]);

    return Cycle.create({
      id: new UUID(raw.id),
      alias: raw.alias,
      offer: week(raw.offer),
      order: week(raw.order),
      deliver: week(raw.deliver),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
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
