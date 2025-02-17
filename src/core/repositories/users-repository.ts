// Entities
import { Role, User } from "@/core/entities/user";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface UsersRepositorySearchRequest {
  id?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  chat?: string;
  role?: Role;
}

export interface UsersRepository {
  find(
    type: RepositoryResponse,
    filters: UsersRepositorySearchRequest
  ): Promise<User | null>;
  list(
    type: RepositoryResponse,
    filters: UsersRepositorySearchRequest,
    page?: number
  ): Promise<User[]>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
