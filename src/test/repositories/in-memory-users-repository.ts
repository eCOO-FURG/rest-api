// Entities
import { User } from "@/core/entities/user";

// Repositories
import {
  UsersRepository,
  UsersRepositorySearchRequest,
  UserRepositoryReturnType,
  UserEntityOf,
} from "@/core/repositories/users-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];

  async find<T extends UserRepositoryReturnType>(
    _: T,
    {
      id,
      email,
      phone,
      cpf,
      chat,
      roles,
      first_name,
      last_name,
    }: UsersRepositorySearchRequest & {
      first_name?: string;
      last_name?: string;
    },
  ): Promise<UserEntityOf<T> | null> {
    const user = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!email || item.email === email) &&
          (!phone || item.phone.equals(phone)) &&
          (!cpf || item.cpf.equals(cpf)) &&
          (!chat || item.chat === chat) &&
          (!first_name || item.first_name === first_name) &&
          (!last_name || item.last_name === last_name) &&
          (!roles || roles.every((role) => item.roles.includes(role))),
      ),
    );

    if (!user) return null;
    return user as UserEntityOf<T>;
  }

  async list<T extends UserRepositoryReturnType>(
    _: T,
    {
      id,
      email,
      phone,
      cpf,
      roles,
      chat,
      first_name,
      last_name,
    }: UsersRepositorySearchRequest & {
      first_name?: string;
      last_name?: string;
    },
    page?: number,
  ): Promise<UserEntityOf<T>[]> {
    let users = this.items.filter((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!email || item.email === email) &&
          (!phone || item.phone.equals(phone)) &&
          (!cpf || item.cpf.equals(cpf)) &&
          (!chat || item.chat === chat) &&
          (!first_name || item.first_name === first_name) &&
          (!last_name || item.last_name === last_name) &&
          (!roles || roles.every((role) => item.roles.includes(role))),
      ),
    );

    if (page) users = paginate(users, page);

    return users.map((user) => user as UserEntityOf<T>);
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id));
    this.items[index] = user;
  }
}
