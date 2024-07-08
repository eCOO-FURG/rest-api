// Libs
import { User as PrismaUser, Prisma } from "@prisma/client";

// Entities
import { User } from "@/core/entities/user";
import { UUID } from "@/core/entities/value-objects/uuid";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser) {
    return User.create({
      ...raw,
      id: new UUID(raw.id),
    });
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      ...user.props,
      id: user.id.value,
    };
  }
}
