// Entities
import { Session } from "@/core/entities/session";

// Repositories
import { SessionsRepository } from "@/core/repositories/sessions-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";
import { PrismaSessionMapper } from "@/infra/database/mappers/prisma-session-mapper";

export interface PrismaSessionsRepositorySearchRequest {
  user_id: string;
  ip: string;
  agent: string;
  since: Date;
}

export class PrismaSessionsRepository implements SessionsRepository {
  async create(session: Session): Promise<void> {
    const data = PrismaSessionMapper.toPrisma(session);

    await prisma.session.create({
      data,
    });
  }

  async search({
    user_id,
    ip,
    agent,
    since,
  }: PrismaSessionsRepositorySearchRequest) {
    const session = await prisma.session.findFirst({
      where: {
        user_id,
        ip,
        agent,
        created_at: {
          gte: since,
        },
      },
    });

    if (!session) return null;

    return PrismaSessionMapper.toDomain(session);
  }
}
