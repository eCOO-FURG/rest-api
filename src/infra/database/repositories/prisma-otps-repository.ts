// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import { OtpsRepository } from "@/core/repositories/otps-repositoy";

// Services
import { PrismaOtpMapper } from "@/infra/database/mappers/prisma-otp-mapper";
import { prisma } from "@/infra/database/prisma-service";

export class PrismaOtpsRepository implements OtpsRepository {
  async findValid(user_id: string, value: string): Promise<Otp | null> {
    const otp = await prisma.otp.findFirst({
      where: {
        user_id,
        used: false,
        value
      },
    });

    if (!otp) return null;

    return PrismaOtpMapper.toDomain(otp);
  }
  async create(otp: Otp): Promise<void> {
    const data = PrismaOtpMapper.toPrisma(otp);

    await prisma.otp.create({
      data,
    });
  }

  async update(otp: Otp): Promise<void> {
    const data = PrismaOtpMapper.toPrisma(otp);

    await prisma.otp.update({
      where: {
        id: otp.id.value,
      },
      data,
    });
  }
}
