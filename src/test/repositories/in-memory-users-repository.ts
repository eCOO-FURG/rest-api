// Entities
import { User } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];

  async findById(id: string): Promise<User | null> {
    const item = this.items.find((item) => item.id.equals(id));

    if (!item) {
      return null;
    }

    return item;
  }

  async findByEmail(email: string): Promise<User | null> {
    const item = this.items.find((item) => item.email === email);

    if (!item) {
      return null;
    }

    return item;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const item = this.items.find((item) => item.phone === phone);

    if (!item) {
      return null;
    }

    return item;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const item = this.items.find((item) => item.cpf === cpf);

    if (!item) {
      return null;
    }

    return item;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id));

    this.items[index] = user;
  }
}
