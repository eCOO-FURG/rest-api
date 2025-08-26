// Entities
import { UserRole } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

interface ListUsersRequest {
  page: number;
  first_name?: string;
  last_name?: string;
  roles?: UserRole[];
  since?: Date;
  before?: Date;
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    first_name,
    last_name,
    roles,
    since,
    before,
  }: ListUsersRequest) {
    const users = await this.usersRepository.list(
      "user",
      { first_name, last_name, roles, since, before },
      page,
    );

    return { users };
  }
}
