// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import {
  OtpsRepository,
  OtpsRepositorySearchRequest,
  OtpRepositoryReturnType,
  OtpEntityOf,
} from "@/core/repositories/otps-repositoy";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOtpMapper } from "@/infra/database/mappers/prisma-otp-mapper";

export class PrismaOtpsRepository implements OtpsRepository {
  async find<T extends OtpRepositoryReturnType>(
    type: T,
    { value, used, user }: OtpsRepositorySearchRequest,
  ): Promise<OtpEntityOf<T> | null> {
    const otp = await prisma.otp.findFirst({
      where: { user, value, used },
      include: { user: type !== "otp" },
    });

    if (!otp) {
      return null;
    }

    return PrismaOtpMapper.toDomain<T>(otp) as OtpEntityOf<T>;
  }

  async create(otp: Otp): Promise<void> {
    const data = PrismaOtpMapper.toPrisma(otp);

    await prisma.otp.create({ data });
  }

  async update(otp: Otp): Promise<void> {
    const data = PrismaOtpMapper.toPrisma(otp);

    await prisma.otp.update({
      where: { id: otp.id.value },
      data,
    });
  }
}
