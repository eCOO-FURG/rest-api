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
    { id, admin, name, caf }: FarmsRepositorySearchRequest,
    type: T
  ): Promise<FarmsRepositoryResponse<T> | null> {
    const farm = this.items.find((item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!admin?.id || item.admin_id.equals(admin.id)) &&
        (!name || item.name.includes(name)) &&
        (!caf || item.caf === caf)
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
}
