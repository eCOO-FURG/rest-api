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
    { id, email, cpf, phone }: UsersRepositorySearchRequest
  ): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { id, email, cpf, phone },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
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
