// Entities
import { Session } from "@/core/entities/session";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma } from "@prisma/client";

// Mappers
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

type PrismaSession = Prisma.SessionGetPayload<{}> & {
  user?: Prisma.UserGetPayload<{}>;
};

export class PrismaSessionMapper {
  static toDomain(raw: PrismaSession): Session {
    return Session.create({
      id: new UUID(raw.id),
      ip: raw.ip,
      agent: raw.agent,
      user_id: new UUID(raw.user_id),
      ...(raw.user && { user: PrismaUserMapper.toDomain(raw.user) }),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
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
