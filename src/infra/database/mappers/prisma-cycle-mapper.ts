// Libs
import { Cycle as PrismaCycle, Prisma } from "@prisma/client";

// Entities
import { Cycle, Week } from "@/core/entities/cycle";
import { UUID } from "@/core/entities/aggregates/uuid";

export class PrismaCycleMapper {
  static toDomain(raw: PrismaCycle) {
    const week = (days: number[]) => days.map((day) => day as Week[0]);

    return Cycle.create({
      ...raw,
      id: new UUID(raw.id),
      offer: week(raw.offer),
      order: week(raw.order),
      deliver: week(raw.deliver),
    });
  }

  static toPrisma(cycle: Cycle): Prisma.CycleUncheckedCreateInput {
    return {
      ...cycle.props,
      id: cycle.id.value,
    };
  }
}
