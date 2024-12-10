// Entities
import { User } from "@/core/entities/user";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface UsersRepositorySearchRequest {
  id?: string;
  email?: string;
  phone?: string;
  cpf?: string;
}

export interface UsersRepository {
  find(
    type: RepositoryResponse,
    filters: UsersRepositorySearchRequest
  ): Promise<User | null>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
