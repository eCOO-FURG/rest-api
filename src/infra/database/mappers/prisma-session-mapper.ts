// Entities
import { Session } from "@/core/entities/session";
import { UUID } from "@/core/entities/value-objects/uuid";

// Libs
import { Prisma, Session as PrismaSession } from "@prisma/client";

export class PrismaSessionMapper {
  static toDomain(raw: PrismaSession) {
    return Session.create({
      ...raw,
      id: new UUID(raw.id),
      user_id: new UUID(raw.user_id),
    });
  }

  static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
    return {
      ...session.props,
      id: session.id.value,
      user_id: session.user_id.value,
    };
  }
}
