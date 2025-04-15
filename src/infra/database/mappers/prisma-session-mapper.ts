// Entities
import { Session } from "@/core/entities/session";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma, Session as PrismaSession } from "@prisma/client";

// Repositories
import { SessionRepositoryReturnType, SessionEntityOf } from "@/core/repositories/sessions-repository";

export class PrismaSessionMapper {
  static toDomain<T extends SessionRepositoryReturnType = "session">(raw: PrismaSession): SessionEntityOf<T> {
    return Session.create({
      id: new UUID(raw.id),
      ip: raw.ip,
      agent: raw.agent,
      user_id: new UUID(raw.user_id),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }) as SessionEntityOf<T>;
  }

  static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
    return {
      id: session.id.value,
      ip: session.ip,
      agent: session.agent,
      user_id: session.user_id.value,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };
  }
}
