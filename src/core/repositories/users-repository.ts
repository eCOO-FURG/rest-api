// Entities
import { User, UserRole } from "@/core/entities/user";

export type UserRepositoryReturnType = "user";

export type UserEntityOf<T extends UserRepositoryReturnType> = T extends "user" ? User : never;

export interface UsersRepositorySearchRequest {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  chat?: string;
  roles?: UserRole[];
  since?: Date;
  before?: Date;
}

export interface UsersRepository {
  find<T extends UserRepositoryReturnType>(
    type: T,
    filters: UsersRepositorySearchRequest,
  ): Promise<UserEntityOf<T> | null>;
  list<T extends UserRepositoryReturnType>(
    type: T,
    filters: UsersRepositorySearchRequest,
    page?: number,
  ): Promise<UserEntityOf<T>[]>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(user: User): Promise<void>;
}
