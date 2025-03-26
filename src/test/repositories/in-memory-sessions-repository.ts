// Entities
import { Session } from "@/core/entities/session";

// Repositories
import {
  SessionsRepository,
  SessionsRepositorySearchRequest,
  SessionRepositoryReturnType,
  SessionEntityOf,
} from "@/core/repositories/sessions-repository";

export class InMemorySessionsRepository implements SessionsRepository {
  items: Session[] = [];

  async find<T extends SessionRepositoryReturnType>(
    _: T,
    { agent, ip, user, since }: SessionsRepositorySearchRequest
  ): Promise<SessionEntityOf<T> | null> {
    const session = this.items.find((item) =>
      Boolean(
        (!agent || item.agent === agent) &&
          (!ip || item.ip === ip) &&
          (!user?.id || item.user?.id.equals(user.id)) &&
          (!since || item.created_at >= since)
      )
    );

    if (!session) return null;

    return session as SessionEntityOf<T>;
  }

  async create(session: Session): Promise<void> {
    this.items.push(session);
  }
}
