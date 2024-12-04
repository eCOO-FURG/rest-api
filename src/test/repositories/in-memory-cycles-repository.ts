// Entities
import { Cycle } from "@/core/entities/cycle";

// Repositories
import {
  CyclesRepository,
  CyclesRepositorySearchRequest,
} from "@/core/repositories/cycles-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";

export class InMemoryCyclesRepository implements CyclesRepository {
  async find(
    _: RepositoryResponse,
    { id }: CyclesRepositorySearchRequest
  ): Promise<Cycle | null> {
    const cycle = await find<Cycle>(
      this.items,
      async (item) => !id || item.id.equals(id)
    );

    if (!cycle) return null;

    return cycle;
  }

  async list(
    _: RepositoryResponse,
    { id }: CyclesRepositorySearchRequest,
    page?: number
  ): Promise<Cycle[]> {
    let cycles = await filter<Cycle>(
      this.items,
      async (item) => !id || item.id.equals(id)
    );

    if (page) cycles = this.slice(cycles, page);

    return cycles;
  }

  private slice(items: Cycle[], page: number, size: number = 20): Cycle[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }

  items: Cycle[] = [];
}
