// Entities
import { User } from "@/core/entities/user";

// Repositories
import {
  UsersRepository,
  UsersRepositorySearchRequest,
} from "@/core/repositories/users-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async find(
    _: RepositoryResponse,
    { id, email, cpf, phone, role }: UsersRepositorySearchRequest
  ): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { id, email, cpf, phone, roles: { has: role } },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async list(
    _: RepositoryResponse,
    { id, email, cpf, phone, role }: UsersRepositorySearchRequest,
    page?: number
  ): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: { id, email, cpf, phone, roles: { has: role } },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.create({ data });
  }

  async update(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.update({ where: { id: user.id.value }, data });
  }
}
