// Entities
import { Session } from "@/core/entities/session";

// Repositories
import {
  SessionsRepository,
  SessionsRepositorySearchRequest,
  SessionRepositoryReturnType,
  SessionEntityOf,
} from "@/core/repositories/sessions-repository";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Mappers
import { PrismaSessionMapper } from "@/infra/database/mappers/prisma-session-mapper";

// Utils
import { now } from "@/core/utils/now";

export class PrismaSessionsRepository implements SessionsRepository {
  async find<T extends SessionRepositoryReturnType>(
    _: T,
    { ip, agent, user, since }: SessionsRepositorySearchRequest,
  ): Promise<SessionEntityOf<T> | null> {
    const session = await prisma.session.findFirst({
      where: {
        ip,
        agent,
        user: { id: user?.id },
        created_at: { gte: since },
      },
    });

    if (!session) {
      return null;
    }

    return PrismaSessionMapper.toDomain<T>(session) as SessionEntityOf<T>;
  }

  async create(session: Session): Promise<void> {
    await prisma.$transaction(async (ctx) => {
      await ctx.session.create({
        data: PrismaSessionMapper.toPrisma(session),
      });

      if (session.user) {
        await ctx.user.update({
          where: { id: session.user.id.value },
          data: { verified_at: now() },
        });
      }
    });
  }
}
