// Entities
import { User } from "@/core/entities/user";

// Repositories
import { UsersRepository } from "@/core/repositories/users-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.create({
      data,
    });
  }

  async update(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.update({
      where: {
        id: user.id.value,
      },
      data,
    });
  }
}
