// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import {
  FarmsRepository,
  FarmsRepositorySearchRequest,
} from "@/core/repositories/farms-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";

export class InMemoryFarmsRepository implements FarmsRepository {
  items: Farm[] = [];

  async find(
    _: RepositoryResponse,
    { id, name, status, tally, admin }: FarmsRepositorySearchRequest
  ): Promise<Farm | null> {
    const farm = await find<Farm>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!admin?.id || item.admin_id.equals(admin.id)) &&
        (!name || item.name.includes(name)) &&
        (!tally || item.tally === tally) &&
        (!status || item.status === status)
      );
    });

    if (!farm) return null;

    return farm;
  }

  async list(
    _: RepositoryResponse,
    { id, admin, name, tally, status }: FarmsRepositorySearchRequest,
    page?: number
  ): Promise<Farm[]> {
    let farms = await filter<Farm>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!admin?.id || item.admin_id.equals(admin.id)) &&
        (!name || item.name.includes(name)) &&
        (!tally || item.tally === tally) &&
        (!status || item.status === status)
      );
    });

    if (page) farms = this.slice(farms, page);

    return farms;
  }

  async create(farm: Farm): Promise<void> {
    this.items.push(farm);
  }

  async update(farm: Farm): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(farm.id));
    this.items[itemIndex] = farm;
  }

  async count({
    status,
    admin,
    id,
    tally,
  }: FarmsRepositorySearchRequest): Promise<number> {
    return this.items.filter((item) => {
      return (
        (!status || item.status === status) &&
        (!admin?.id || item.admin_id.equals(admin.id)) &&
        (!id || item.id.equals(id)) &&
        (!tally || item.tally === tally)
      );
    }).length;
  }

  private slice(items: Farm[], page: number, size: number = 20): Farm[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
