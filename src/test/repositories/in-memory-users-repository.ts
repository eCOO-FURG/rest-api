// Entities
import { User } from "@/core/entities/user";

// Repositories
import {
  UsersRepository,
  UsersRepositorySearchRequest,
} from "@/core/repositories/users-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];

  async find(
    _: RepositoryResponse,
    { id, email, phone, cpf }: UsersRepositorySearchRequest
  ): Promise<User | null> {
    const user = await find<User>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!email || item.email === email) &&
        (!phone || item.phone === phone) &&
        (!cpf || item.cpf === cpf)
    );

    if (!user) return null;

    return user;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id));

    this.items[index] = user;
  }
}
