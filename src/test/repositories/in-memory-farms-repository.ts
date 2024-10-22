// Entities
import { Farm } from "@/core/entities/farm";
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

// Repositories
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import {
  FarmsRepository,
  FarmsRepositoryResponse,
  FarmsRepositorySearchRequest,
} from "@/core/repositories/farms-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class InMemoryFarmsRepository implements FarmsRepository {
  items: Farm[] = [];

  constructor(private inMemoryUsersRepository: InMemoryUsersRepository) {}

  async search<T extends RepositoryResponse>(
    { id, admin, name, counterfoil_number }: FarmsRepositorySearchRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T> | null> {
    const farm = this.items.find((item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!admin?.id || item.admin_id.equals(admin.id)) &&
        (!name || item.name.includes(name)) &&
        (!counterfoil_number || item.counterfoil_number === counterfoil_number)
      );
    });

    if (!farm) return null;

    if (type === "entity") return farm as FarmsRepositoryResponse<T>;

    const _admin = await this.inMemoryUsersRepository.findById(
      farm.admin_id.value
    );

    if (!_admin) return null;

    const aggregate = FarmAggregate.create({
      ...farm.props,
      admin: _admin,
    });

    return aggregate as FarmsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse = "entity">(
    { page, name }: { page: number; name?: string },
    type = "entity"
  ): Promise<FarmsRepositoryResponse<T>[]> {
    const farms = this.items.filter(
      (farm) => !name || farm.name.includes(name)
    );

    const slicedFarms = farms.slice((page - 1) * 20, page * 20);

    if (type === "entity") {
      return slicedFarms as FarmsRepositoryResponse<T>[];
    }

    const aggregates = [];

    for (const farm of slicedFarms) {
      const _admin = await this.inMemoryUsersRepository.findById(
        farm.admin_id.value
      );

      if (!_admin) continue;

      const aggregate = FarmAggregate.create({ ...farm.props, admin: _admin });

      aggregates.push(aggregate);
    }

    return aggregates as FarmsRepositoryResponse<T>[];
  }

  async create(farm: Farm): Promise<void> {
    this.items.push(farm);

    const user = await this.inMemoryUsersRepository.findById(
      farm.admin_id.value
    );

    if (!user) {
      return;
    }

    user.roles.push("PRODUCER");

    await this.inMemoryUsersRepository.update(user);
  }

  async update(farm: Farm): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(farm.id));

    this.items[itemIndex] = farm;
  }

  async findById(id: string): Promise<Farm | null> {
    const farm = this.items.find((item) => item.id.equals(id));

    if (!farm) return null;

    return farm;
  }
}
