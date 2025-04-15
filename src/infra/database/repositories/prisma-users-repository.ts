// Entities
import { User } from "@/core/entities/user";

// Repositories
import {
  UsersRepository,
  UsersRepositorySearchRequest,
  UserRepositoryReturnType,
  UserEntityOf,
} from "@/core/repositories/users-repository";

// Database
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async find<T extends UserRepositoryReturnType>(
    _: T,
    { id, email, cpf, phone, chat, roles }: UsersRepositorySearchRequest,
  ): Promise<UserEntityOf<T> | null> {
    const user = await prisma.user.findFirst({
      where: {
        id,
        email,
        cpf,
        phone,
        chat,
        ...(roles && { roles: { hasEvery: roles } }),
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain<T>(user);
  }

  async list<T extends UserRepositoryReturnType>(
    _: T,
    { id, email, cpf, phone, chat, roles }: UsersRepositorySearchRequest,
    page?: number,
  ): Promise<UserEntityOf<T>[]> {
    const users = await prisma.user.findMany({
      where: {
        id,
        email,
        cpf,
        phone,
        chat,
        ...(roles && { roles: { hasEvery: roles } }),
      },
      ...(page && { skip: (page - 1) * 20, take: 20 }),
    });

    return users.map(PrismaUserMapper.toDomain<T>);
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({ data: PrismaUserMapper.toPrisma(user) });
  }

  async update(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id.value },
      data: PrismaUserMapper.toPrisma(user),
    });
  }
}
