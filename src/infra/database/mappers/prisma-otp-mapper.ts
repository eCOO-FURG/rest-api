// Libraries
import { Prisma, Otp as PrismaOtp } from "@prisma/client";

// Entities
import { Otp } from "@/core/entities/otp";
import { UUID } from "@/core/entities/aggregates/uuid";

// Repositories
import {
  OtpRepositoryReturnType,
  OtpEntityOf,
} from "@/core/repositories/otps-repositoy";

export class PrismaOtpMapper {
  static toDomain<T extends OtpRepositoryReturnType>(
    raw: PrismaOtp
  ): OtpEntityOf<T> {
    return Otp.create({
      id: new UUID(raw.id),
      value: raw.value,
      used: raw.used,
      user_id: new UUID(raw.user_id),
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
