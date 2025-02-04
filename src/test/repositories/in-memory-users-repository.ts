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
import { filter } from "@/test/utils/filter";
import { paginate } from "@/test/utils/paginate";

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];

  async find(
    _: RepositoryResponse,
    { id, email, phone, cpf, role }: UsersRepositorySearchRequest
  ): Promise<User | null> {
    const user = await find<User>(this.items, async (item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!email || item.email === email) &&
          (!phone || item.phone.equals(phone)) &&
          (!cpf || item.cpf.equals(cpf)) &&
          (!role || item.roles.includes(role))
      )
    );

    if (!user) return null;

    return user;
  }

  async list(
    _: RepositoryResponse,
    { id, email, phone, cpf, role }: UsersRepositorySearchRequest,
    page?: number
  ): Promise<User[]> {
    let users = await filter<User>(this.items, async (item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!email || item.email === email) &&
          (!phone || item.phone.equals(phone)) &&
          (!cpf || item.cpf.equals(cpf)) &&
          (!role || item.roles.includes(role))
      )
    );

    if (page) users = paginate(users, page);

    return users;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id));

    this.items[index] = user;
  }
}
