// Entities
import { Session } from "@/core/entities/session";

// Repositories
import { SessionsRepository } from "@/core/repositories/sessions-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";
import { PrismaSessionMapper } from "@/infra/database/mappers/prisma-session-mapper";

export class PrismaSessionsRepository implements SessionsRepository {
  async create(session: Session): Promise<void> {
    const data = PrismaSessionMapper.toPrisma(session);

    await prisma.session.create({
      data,
    });
  }
}
