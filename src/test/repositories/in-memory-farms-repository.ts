// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import {
  FarmsRepository,
  FarmsRepositorySearchRequest,
  FarmRepositoryReturnType,
  FarmEntityOf,
} from "@/core/repositories/farms-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

export class InMemoryFarmsRepository implements FarmsRepository {
  items: FarmEntityOf<FarmRepositoryReturnType>[] = [];

  async find<T extends FarmRepositoryReturnType>(
    type: T,
    { id, name, status, tally, admin }: FarmsRepositorySearchRequest,
  ): Promise<FarmEntityOf<T> | null> {
    const farm = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!admin?.id || item.admin_id.equals(admin.id)) &&
          (!name || item.name.includes(name)) &&
          (!tally || item.tally === tally) &&
          (!status || item.status === status),
      ),
    );

    if (!farm) return null;

    return farm as FarmEntityOf<T>;
  }

  async list<T extends FarmRepositoryReturnType>(
    _: T,
    { id, admin, name, tally, status }: FarmsRepositorySearchRequest,
    page?: number,
  ): Promise<FarmEntityOf<T>[]> {
    let farms = this.items.filter((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!admin?.id || item.admin_id.equals(admin.id)) &&
          (!name || item.name.includes(name)) &&
          (!tally || item.tally === tally) &&
          (!status || item.status === status),
      ),
    );

    if (page) {
      farms = paginate(farms, page);
    }

    return farms as FarmEntityOf<T>[];
  }

  async create(farm: Farm): Promise<void> {
    this.items.push(farm);
  }

  async update(farm: Farm): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(farm.id));
    this.items[itemIndex] = farm;
  }

  async count({ status, admin, id, tally }: FarmsRepositorySearchRequest): Promise<number> {
    return this.items.filter((item) =>
      Boolean(
        (!status || item.status === status) &&
          (!admin?.id || item.admin_id.equals(admin.id)) &&
          (!id || item.id.equals(id)) &&
          (!tally || item.tally === tally),
      ),
    ).length;
  }
}
