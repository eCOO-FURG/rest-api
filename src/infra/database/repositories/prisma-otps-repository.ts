// Entities
import { Otp } from "@/core/entities/otp";

// Repositories
import {
  OtpsRepository,
  OtpsRepositorySearchRequest,
} from "@/core/repositories/otps-repositoy";
import { RepositoryResponse } from "@/core/types/repository-response";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaOtpMapper } from "@/infra/database/mappers/prisma-otp-mapper";

export class PrismaOtpsRepository implements OtpsRepository {
  async find(
    type: RepositoryResponse,
    { value, used, user }: OtpsRepositorySearchRequest
  ): Promise<Otp | null> {
    const otp = await prisma.otp.findFirst({
      where: { user, value, used },
      include: { user: type !== "basic" },
    });

    if (!otp) return null;

    return PrismaOtpMapper.toDomain(otp);
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
