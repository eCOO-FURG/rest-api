// Entities
import { User, UserRole } from "@/core/entities/user";

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
    {
      id,
      email,
      cpf,
      phone,
      chat,
      roles,
      first_name,
      last_name,
    }: UsersRepositorySearchRequest,
    page?: number,
  ): Promise<UserEntityOf<T>[]> {
    const validRoles = roles?.filter((role) =>
      User.roles.includes(role as UserRole),
    );

    const users = await prisma.user.findMany({
      where: {
        id,
        email,
        cpf,
        phone,
        chat,
        ...(validRoles && validRoles.length > 0
          ? { roles: { hasEvery: validRoles } }
          : {}),
        ...(first_name && {
          first_name: { contains: first_name, mode: "insensitive" },
        }),
        ...(last_name && {
          last_name: { contains: last_name, mode: "insensitive" },
        }),
      },
      skip: page ? (page - 1) * 20 : undefined,
      take: page ? 20 : undefined,
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
