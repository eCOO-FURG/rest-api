// Entities
import { Farm } from "@/core/entities/farm";

// Repositories
import { FarmRepository } from "@/core/repositories/farm-repository";
import { InMemoryUsersRepository } from "./in-memory-users-repository";

export class InMemoryFarmRepository implements FarmRepository {
  items: Farm[] = [];

  constructor(private inMemoryUsersRepository: InMemoryUsersRepository) {}

  async findById(id: string): Promise<Farm | null> {
    const farm = this.items.find((item) => item.id.equals(id));

    if (!farm) return null;

    return farm;
  }

  async findByCaf(caf: string): Promise<Farm | null> {
    const farm = this.items.find((item) => item.caf === caf);

    if (!farm) return null;

    return farm;
  }

  async findByAdminId(admin_id: string): Promise<Farm | null> {
    const farm = this.items.find((item) => item.admin_id.equals(admin_id));

    if (!farm) return null;

    return farm;
  }

  async save(farm: Farm): Promise<void> {
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
