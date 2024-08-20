// Libs
import { Prisma, Otp as PrismaOtp } from "@prisma/client";

// Entities
import { Otp } from "@/core/entities/otp";
import { UUID } from "@/core/entities/aggregates/uuid";

export class PrismaOtpMapper {
  static toDomain(raw: PrismaOtp) {
    return Otp.create({
      ...raw,
      user_id: new UUID(raw.user_id),
      id: new UUID(raw.id),
    });
  }

  static toPrisma(otp: Otp): Prisma.OtpUncheckedCreateInput {
    return {
      ...otp.props,
      id: otp.id.value,
      user_id: otp.user_id.value,
    };
  }
}
