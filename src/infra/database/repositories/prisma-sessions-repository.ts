// Entities
import { Session } from "@/core/entities/session";

// Repositories
import {
  SessionsRepository,
  SessionsRepositorySearchRequest,
} from "@/core/repositories/sessions-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaSessionMapper } from "@/infra/database/mappers/prisma-session-mapper";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class PrismaSessionsRepository implements SessionsRepository {
  async find(
    type: RepositoryResponse,
    { ip, agent, user, since }: SessionsRepositorySearchRequest
  ): Promise<Session | null> {
    const session = await prisma.session.findFirst({
      where: {
        ip,
        agent,
        user: { id: user?.id },
        created_at: { gte: since },
      },
      include: { user: type !== "basic" },
    });

    if (!session) return null;

    return PrismaSessionMapper.toDomain(session);
  }

  async create(session: Session): Promise<void> {
    const data = PrismaSessionMapper.toPrisma(session);

    await prisma.session.create({ data });
  }
}
