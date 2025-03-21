// Libraries
import { Prisma } from "@prisma/client";

// Entities
import { Otp } from "@/core/entities/otp";
import { UUID } from "@/core/entities/aggregates/uuid";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

// Repositories
import {
  OtpRepositoryReturnType,
  OtpEntityOf,
} from "@/core/repositories/otps-repositoy";

type PrismaOtp = Prisma.OtpGetPayload<{}> & {
  user?: Prisma.UserGetPayload<{}>;
};

export class PrismaOtpMapper {
  static toDomain<T extends OtpRepositoryReturnType>(
    raw: PrismaOtp
  ): OtpEntityOf<T> {
    return Otp.create({
      id: new UUID(raw.id),
      value: raw.value,
      used: raw.used,
      user_id: new UUID(raw.user_id),
      ...(raw.user && { user: PrismaUserMapper.toDomain(raw.user) }),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as OtpEntityOf<T>;
  }

  static toPrisma(otp: Otp): Prisma.OtpUncheckedCreateInput {
    return {
      id: otp.id.value,
      value: otp.value,
      used: otp.used,
      user_id: otp.user_id.value,
      created_at: otp.created_at,
      updated_at: otp.updated_at,
    };
  }
}
