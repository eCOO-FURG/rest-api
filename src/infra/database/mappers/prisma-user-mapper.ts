// Libraries
import { Prisma } from "@prisma/client";

// Entities
import { User } from "@/core/entities/user";
import { UUID } from "@/core/entities/aggregates/uuid";
import { CPF } from "@/core/entities/cpf";
import { Phone } from "@/core/entities/phone";

// Repositories
import {
  UserRepositoryReturnType,
  UserEntityOf,
} from "@/core/repositories/users-repository";

type PrismaUser = Prisma.UserGetPayload<{}>;

export class PrismaUserMapper {
  static toDomain<T extends UserRepositoryReturnType>(
    raw: PrismaUser
  ): UserEntityOf<T> {
    return User.create({
      id: new UUID(raw.id),
      first_name: raw.first_name,
      last_name: raw.last_name,
      cpf: new CPF(raw.cpf),
      email: raw.email,
      phone: new Phone(raw.phone),
      photo: raw.photo,
      password: raw.password,
      chat: raw.chat,
      verified_at: raw.verified_at,
      roles: raw.roles,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as UserEntityOf<T>;
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.value,
      first_name: user.first_name,
      last_name: user.last_name,
      cpf: user.cpf.value,
      email: user.email,
      phone: user.phone.value,
      photo: user.photo,
      chat: user.chat,
      password: user.password,
      verified_at: user.verified_at,
      roles: user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
