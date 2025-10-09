// Entities
import { Cycle } from "@/core/entities/cycle";

// Repositories
import {
  CyclesRepository,
  CyclesRepositorySearchRequest,
  CycleRepositoryReturnType,
  CycleEntityOf,
} from "@/core/repositories/cycles-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

export class InMemoryCyclesRepository implements CyclesRepository {
  items: Cycle[] = [];

  async find<T extends CycleRepositoryReturnType>(
    _: T,
    { id }: CyclesRepositorySearchRequest,
  ): Promise<CycleEntityOf<T> | null> {
    const cycle = this.items.find((item) => Boolean(!id || item.id.equals(id)));

    if (!cycle) return null;

    return cycle as CycleEntityOf<T>;
  }

  async list<T extends CycleRepositoryReturnType>(
    _: T,
    { id }: CyclesRepositorySearchRequest,
    page?: number,
  ): Promise<CycleEntityOf<T>[]> {
    let cycles = this.items.filter((item) => Boolean(!id || item.id.equals(id)));

    if (page) cycles = paginate(cycles, page);

    return cycles as CycleEntityOf<T>[];
  }
}
