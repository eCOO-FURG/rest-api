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

  constructor(private inMemoryUsersRepository: InMemoryUsersRepository) {}

  async find(
    type: RepositoryResponse,
    filters: FarmsRepositorySearchRequest
  ): Promise<Farm | null> {
    const farm = await find<Farm>(this.items, async (item) => {
      return (
        (!filters.id || item.id.equals(filters.id)) &&
        (!filters.admin?.id || item.admin_id.equals(filters.admin.id)) &&
        (!filters.tally || item.tally === filters.tally)
      );
    });

    if (!farm) return null;

    if (type === "basic") return farm;

    const user = await this.inMemoryUsersRepository.find("basic", {
      id: farm.admin_id.value,
    });

    if (!user) return null;

    return Farm.create({ ...farm.props, admin: user });
  }

  async list(
    type: RepositoryResponse,
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

    if (type === "basic") return farms;

    for (const [index, farm] of farms.entries()) {
      const user = await this.inMemoryUsersRepository.find("basic", {
        id: farm.admin_id.value,
      });

      if (!user) continue;

      farms[index] = Farm.create({ ...farm.props, admin: user });
    }

    return farms;
  }

  async create(farm: Farm): Promise<void> {
    this.items.push(farm);

    const user = await this.inMemoryUsersRepository.find("basic", {
      id: farm.admin_id.value,
    });

    if (!user) return;

    user.roles.push("PRODUCER");

    await this.inMemoryUsersRepository.update(user);
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
