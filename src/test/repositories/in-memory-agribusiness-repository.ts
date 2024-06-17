// Entities
import { Agribusiness } from "@/core/entities/agribusiness";

// Repositories
import { AgribusinessRepository } from "@/core/repositories/agribusiness-repository";
import { InMemoryUsersRepository } from "./in-memory-users-repository";

export class InMemoryAgribusinessRepository implements AgribusinessRepository {
  items: Agribusiness[] = [];

  constructor(private inMemoryUsersRepository: InMemoryUsersRepository) {}

  async findById(id: string): Promise<Agribusiness | null> {
    const agribusiness = this.items.find((item) => item.id.equals(id));

    if (!agribusiness) return null;

    return agribusiness;
  }

  async findByCaf(caf: string): Promise<Agribusiness | null> {
    const agribusiness = this.items.find((item) => item.caf === caf);

    if (!agribusiness) return null;

    return agribusiness;
  }

  async findByAdminId(admin_id: string): Promise<Agribusiness | null> {
    const agribusiness = this.items.find((item) =>
      item.admin_id.equals(admin_id)
    );

    if (!agribusiness) return null;

    return agribusiness;
  }

  async save(agribusiness: Agribusiness): Promise<void> {
    this.items.push(agribusiness);

    const user = await this.inMemoryUsersRepository.findById(
      agribusiness.admin_id.value
    );

    if (!user) {
      return;
    }

    user.roles.push("PRODUCER");

    await this.inMemoryUsersRepository.update(user);
  }

  async update(agribusiness: Agribusiness): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(agribusiness.id)
    );

    this.items[itemIndex] = agribusiness;
  }
}
