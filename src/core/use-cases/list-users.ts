// Entities
import { User } from "@/core/entities/user";

// Repositories
import { UsersRepository, UsersRepositorySearchRequest } from "@/core/repositories/users-repository";

interface ListUsersRequest {
  page: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
}

interface ListUsersResponse {
  users: User[];
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    first_name,
    last_name,
    roles,
  }: ListUsersRequest): Promise<ListUsersResponse> {
    const filters: UsersRepositorySearchRequest = {};

    if (first_name) {
      filters.first_name = first_name;
    }

    if (last_name) {
      filters.last_name = last_name;
    }

    if (roles && roles.length > 0) {
      filters.roles = roles;
    }

    const users = await this.usersRepository.list("user", filters, page);

    return { users };
  }
}
