// Entities
import { Cycle } from "@/core/entities/cycle";

// Repositories
import { CyclesRepository } from "@/core/repositories/cycles-repository";

export class InMemoryCyclesRepository implements CyclesRepository {
  items: Cycle[] = [];

  async findById(id: string): Promise<Cycle | null> {
    const cycle = this.items.find((cycle) => cycle.id.equals(id));

    if (!cycle) {
      return null;
    }

    return cycle;
  }

  async create(cycle: Cycle): Promise<void> {
    this.items.push(cycle);
  }
}
